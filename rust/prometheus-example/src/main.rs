use axum::body::Body;
use axum::extract::{Request, State};
use axum::http::header::CONTENT_TYPE;
use axum::http::{HeaderName, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{middleware, Router};
use prometheus_client::encoding::text::encode;
use prometheus_client::metrics::counter::Counter;
use prometheus_client::metrics::exemplar::{CounterWithExemplar, HistogramWithExemplars};
use prometheus_client::metrics::family::Family;
use prometheus_client::metrics::gauge::Gauge;
use prometheus_client::registry::Registry;
use prometheus_client_derive_encode::{EncodeLabelSet, EncodeLabelValue};
use rand::Rng;
use serde::Deserialize;
use std::sync::atomic::AtomicU64;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::process::Command;
use tokio::sync::Mutex;
use tokio::time::sleep;
use tower::ServiceBuilder;
use tower_http::request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer};

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelValue)]
pub enum Method {
    Get,
    Post,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelSet)]
pub struct MethodLabels {
    pub method: Method,
    pub path: String,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelValue)]
pub enum Stat {
    Memory,
    CPU,
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
    request_timings: Family<MethodLabels, HistogramWithExemplars<TraceLabel>>,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq, EncodeLabelSet)]
pub struct TraceLabel {
    pub trace_id: String,
}

impl Metrics {
    pub fn inc_requests(&self, method: Method, path: String) {
        self.requests
            .get_or_create(&MethodLabels { method, path })
            .inc();
    }

    pub fn set_stat(&self, stat: Stat, name: String, value: f64) {
        self.stats
            .get_or_create(&StatLabels { stat, name })
            .set(value);
    }

    pub fn set_request_timings(&self, method: Method, trace_id: String, path: String, value: f64) {
        self.request_timings
            .get_or_create(&MethodLabels { method, path })
            .observe(value, Some(TraceLabel { trace_id }));
    }
}

#[derive(Debug)]
pub struct AppState {
    pub registry: Registry,
}

async fn my_middleware(
    State(metrics): State<Arc<Mutex<Metrics>>>,
    // you can add more extractors here but the last
    // extractor must implement `FromRequest` which
    // `Request` does
    request: Request,
    next: Next,
) -> Response {
    // do something with `request`...
    let now = Instant::now();

    let trace_id = request
        .headers()
        .get(REQUEST_ID_HEADER)
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    let method = match *request.method() {
        axum::http::Method::GET => Method::Get,
        axum::http::Method::POST => Method::Post,
        _ => Method::Get,
    };
    let path = request.uri().path().to_string();

    let response = next.run(request).await;

    // do something with `response`...

    let request_time = now.elapsed().as_micros();

    println!("{} {}", path, request_time);
    metrics
        .lock()
        .await
        .set_request_timings(method, trace_id, path, request_time as f64);
    response
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

pub async fn some_handler() -> impl IntoResponse {
    let do_sleep = rand::thread_rng().gen_bool(0.1);
    if do_sleep {
        let random_number = rand::thread_rng().gen_range(100..2000);
        sleep(Duration::from_millis(random_number)).await;
        return "sleep".to_string();
    }
    "okay".to_string()
}

pub async fn get_docker_stats() -> Vec<(String, f64, f64)> {
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
            (stats.name, mem, cpu)
        })
        .collect()
}

#[derive(Debug, Deserialize)]
struct DockerStats {
    // #[serde(rename = "BlockIO")]
    // block_io: String,
    #[serde(rename = "CPUPerc")]
    cpu_perc: String,
    // #[serde(rename = "Container")]
    // container: String,
    // #[serde(rename = "ID")]
    // id: String,
    #[serde(rename = "MemPerc")]
    mem_perc: String,
    // #[serde(rename = "MemUsage")]
    // mem_usage: String,
    #[serde(rename = "Name")]
    name: String,
    // #[serde(rename = "NetIO")]
    // net_io: String,
    // #[serde(rename = "PIDs")]
    // pids: String,
}

const REQUEST_ID_HEADER: &str = "x-request-id";

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    let metrics = Metrics {
        requests: Family::default(),
        stats: Family::default(),
        request_timings: Family::new_with_constructor(|| {
            let buckets_secs = [
                0.0001, 0.0005, 0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5,
                2.0, 2.5, 3.0, 4.0, 5.0,
            ];
            let buckets_millis = buckets_secs.iter().map(|s| s * 1000.0);
            let buckets_micros = buckets_millis.map(|s| s * 1000.0);
            HistogramWithExemplars::new(buckets_micros.into_iter())
        }),
    };
    let mut state = AppState {
        registry: Registry::default(),
    };
    state
        .registry
        .register("requests", "Count of requests", metrics.requests.clone());
    state.registry.register(
        "request_timings",
        "Request timings",
        metrics.request_timings.clone(),
    );
    state
        .registry
        .register("docker_stats", "Docker stats", metrics.stats.clone());
    let metrics = Arc::new(Mutex::new(metrics));
    let state = Arc::new(Mutex::new(state));

    let met = metrics.clone();
    let join_handle = tokio::spawn(async move {
        loop {
            let docker_stats = get_docker_stats().await;
            met.lock().await.stats.clear();
            for stat in docker_stats {
                let (name, mem, cpu) = stat;
                met.lock().await.set_stat(Stat::Memory, name.clone(), mem);
                met.lock().await.set_stat(Stat::CPU, name, cpu);
            }
            tokio::time::sleep(std::time::Duration::from_secs(5)).await;
        }
    });

    let x_request_id_header = HeaderName::from_static(REQUEST_ID_HEADER);

    let middleware = ServiceBuilder::new()
        .layer(SetRequestIdLayer::new(
            x_request_id_header.clone(),
            MakeRequestUuid,
        ))
        // send headers from request to response headers
        .layer(PropagateRequestIdLayer::new(x_request_id_header));

    let router = Router::new()
        .route("/metrics", get(metrics_handler))
        .with_state(state)
        .route("/handler", get(some_handler))
        .with_state(metrics.clone())
        .route_layer(middleware::from_fn_with_state(
            metrics.clone(),
            my_middleware,
        ))
        .layer(middleware);

    let port = 9091;
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();

    axum::serve(listener, router).await.unwrap();
    join_handle.await.unwrap();
}
