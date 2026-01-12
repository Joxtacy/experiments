use axum::body::Body;
use axum::extract::State;
use axum::http::header::CONTENT_TYPE;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::Router;
use prometheus_client::encoding::text::encode;
use prometheus_client::metrics::counter::Counter;
use prometheus_client::metrics::family::Family;
use prometheus_client::metrics::gauge::Gauge;
use prometheus_client::registry::Registry;
use prometheus_client_derive_encode::{EncodeLabelSet, EncodeLabelValue};
use regex::Regex;
use serde::Deserialize;
use std::borrow::BorrowMut;
use tokio::process::Command;
use tokio::signal;
//use std::process::Command;
use std::sync::atomic::AtomicU64;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelValue)]
pub enum Method {
    Get,
    Post,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelSet)]
pub struct MethodLabels {
    pub method: Method,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelValue)]
pub enum Stat {
    Memory,
    CPU,
    MemUsage,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelSet)]
pub struct StatLabels {
    pub stat: Stat,
    pub name: String,
}

#[derive(Debug)]
pub struct Metrics {
    requests: Family<MethodLabels, Counter>,
    stats: Family<StatLabels, Gauge<f64, AtomicU64>>,
}

impl Metrics {
    pub fn inc_requests(&self, method: Method) {
        self.requests.get_or_create(&MethodLabels { method }).inc();
    }

    pub fn set_stat(&self, stat: Stat, name: String, value: f64) {
        self.stats
            .get_or_create(&StatLabels { stat, name })
            .set(value);
    }
}

#[derive(Debug)]
pub struct AppState {
    pub registry: Registry,
}

pub async fn metrics_handler(State(state): State<Arc<Mutex<AppState>>>) -> impl IntoResponse {
    let state = state.lock().await;
    let mut buffer = String::new();
    encode(&mut buffer, &state.registry).unwrap();

    Response::builder()
        .status(StatusCode::OK)
        .header(
            CONTENT_TYPE,
            "application/openmetrics-text; version=1.0.0; charset=utf-8",
        )
        .body(Body::from(buffer))
        .unwrap()
}

pub async fn some_handler(State(metrics): State<Arc<Mutex<Metrics>>>) -> impl IntoResponse {
    metrics.lock().await.inc_requests(Method::Get);
    "okay".to_string()
}

pub async fn get_docker_stats() -> Vec<(String, f64, f64, f64)> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("docker stats --no-stream --format '{{json .}}'")
        .output()
        .await
        .expect("failed to execute process");

    String::from_utf8_lossy(&output.stdout)
        .lines()
        .map(|line| serde_json::from_str::<DockerStats>(line).unwrap())
        .map(|stats| {
            let mem = stats
                .mem_perc
                .split('%')
                .next()
                .unwrap()
                .parse::<f64>()
                .unwrap();
            let cpu = stats
                .cpu_perc
                .split('%')
                .next()
                .unwrap()
                .parse::<f64>()
                .unwrap();
            let mem_usage = to_megabytes(&stats.mem_usage).unwrap_or(0.0);
            (stats.name, mem, cpu, mem_usage)
        })
        .collect()
}

#[derive(Debug, Deserialize)]
struct DockerStats {
    #[serde(rename = "BlockIO")]
    block_io: String,
    #[serde(rename = "CPUPerc")]
    cpu_perc: String,
    #[serde(rename = "Container")]
    container: String,
    #[serde(rename = "ID")]
    id: String,
    #[serde(rename = "MemPerc")]
    mem_perc: String,
    #[serde(rename = "MemUsage")]
    mem_usage: String,
    #[serde(rename = "Name")]
    name: String,
    #[serde(rename = "NetIO")]
    net_io: String,
    #[serde(rename = "PIDs")]
    pids: String,
}

#[test]
fn mem_usage_test() {
    let mib = to_megabytes("392.3MiB / 15.66GiB");
    let gib = to_megabytes("1.579GiB / 15.66GiB");

    assert_eq!(mib, Some(392.3));
    assert_eq!(gib, Some(1616.896));
}

fn to_megabytes(input: &str) -> Option<f64> {
    let re = Regex::new(r"(?i)^([\d.]+)\s*(MiB|GiB|KiB|B)").unwrap();

    if let Some(caps) = re.captures(input) {
        let value: f64 = caps.get(1)?.as_str().parse().ok()?;
        let unit = caps.get(2)?.as_str();

        let multiplier = match unit {
            "B" => 1.0 / 1024.0 / 1024.0,
            "KiB" => 1.0 / 1024.0,
            "MiB" => 1.0,
            "GiB" => 1024.0,
            _ => return None,
        };

        Some(value * multiplier)
    } else {
        None
    }
}

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    let metrics = Metrics {
        requests: Family::default(),
        stats: Family::default(),
    };
    let mut state = AppState {
        registry: Registry::default(),
    };
    state
        .registry
        .register("requests", "Count of requests", metrics.requests.clone());
    state
        .registry
        .register("docker_stats", "Docker stats", metrics.stats.clone());
    let metrics = Arc::new(Mutex::new(metrics));
    let state = Arc::new(Mutex::new(state));

    let met = metrics.clone();
    let background_task = tokio::spawn(async move {
        loop {
            let docker_stats = get_docker_stats().await;
            met.lock().await.stats.clear();
            for stat in docker_stats {
                let (name, mem, cpu, mem_usage) = stat;
                met.lock().await.set_stat(Stat::Memory, name.clone(), mem);
                met.lock().await.set_stat(Stat::CPU, name.clone(), cpu);
                met.lock().await.set_stat(Stat::MemUsage, name, mem_usage);
            }
            println!("Docker stats updated");
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
        }
    });

    let router = Router::new()
        .route("/metrics", get(metrics_handler))
        .with_state(state)
        .route("/handler", get(some_handler))
        .with_state(metrics);
    let port = 9091;
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();

    let server_with_shutdown =
        axum::serve(listener, router).with_graceful_shutdown(shutdown_signal());

    tokio::select! {
        _ = server_with_shutdown => {
            println!("\nServer stopped");
        }
        _ = shutdown_signal() => {
            println!("\nShutdown signal received");
        }
    }
    background_task.abort();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
