use std::{sync::Arc, time::Duration};

use axum::{
    body::Bytes,
    extract::{MatchedPath, State},
    http::{HeaderMap, Request},
    response::Response,
    routing::{get, post},
    Json, Router,
};
use escpos_rs::{command::Font, Printer, PrinterProfile};
use serde::{Deserialize, Serialize};
use tower_http::{classify::ServerErrorsFailureClass, trace::TraceLayer};
use tracing::{info_span, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all(serialize = "camelCase", deserialize = "snake_case"))]
pub struct Issue {
    pub issue: IssueDetails,
    pub user: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct IssueDetails {
    #[serde(rename = "self")]
    pub _self: String, // URL to the issue
    pub id: u64,     // ID of the issue
    pub key: String, // Issue key (e.g., INTE-3353)
    pub fields: Fields,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Fields {
    // pub fix_versions: Vec<String>,
    pub resolution: Resolution,
    pub priority: Priority,
    pub labels: Vec<String>,
    pub assignee: Option<Assignee>,
    pub creator: Assignee,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Resolution {
    #[serde(rename = "self")]
    pub _self: String,
    pub id: String,
    pub description: String,
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Priority {
    #[serde(rename = "self")]
    pub _self: String,
    pub id: String,
    pub icon_url: String,
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Assignee {
    #[serde(rename = "self")]
    pub _self: String,
    pub account_id: String,
    pub email_address: String,
    pub display_name: String,
    pub active: bool,
    pub time_zone: String,
    pub account_type: String,
    pub avatar_urls: AvatarUrls,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AvatarUrls {
    #[serde(rename = "48x48")]
    pub _48x48: String,
    #[serde(rename = "32x32")]
    pub _32x32: String,
    #[serde(rename = "24x24")]
    pub _24x24: String,
    #[serde(rename = "16x16")]
    pub _16x16: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                // axum logs rejections from built-in extractors with the `axum::rejection`
                // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                format!(
                    "{}=debug,tower_http=debug,axum::rejection=trace",
                    "printer-server" // "{}=debug,tower_http=debug,axum::rejection=trace",
                                     // env!("CARGO_CRATE_NAME")
                )
                .into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // We create a usb contest for the printer
    let printer_profile = PrinterProfile::usb_builder(0x0483, 0x5743)
        .with_font_width(Font::FontA, 48)
        .with_font_width(Font::FontB, 60) // FontB-E are the same
        .build();
    // We pass it to the printer
    let printer = match Printer::new(printer_profile) {
        Ok(maybe_printer) => match maybe_printer {
            Some(printer) => printer,
            None => panic!("No printer was found :("),
        },
        Err(e) => panic!("Error: {}", e),
    };

    let app = Router::new()
        .route("/", get(hello_world))
        .route("/printer", post(print_data))
        .route("/jira", post(jira_issue))
        // `TraceLayer` is provided by tower-http so you have to add that as a dependency.
        // It provides good defaults but is also very customizable.
        //
        // See https://docs.rs/tower-http/0.1.1/tower_http/trace/index.html for more details.
        //
        // If you want to customize the behavior using closures here is how.
        .layer(
            TraceLayer::new_for_http().make_span_with(|request: &Request<_>| {
                // Log the matched route's path (with placeholders not filled in).
                // Use request.uri() or OriginalUri if you want the real path.
                let matched_path = request
                    .extensions()
                    .get::<MatchedPath>()
                    .map(MatchedPath::as_str);

                info_span!(
                    "http_request",
                    method = ?request.method(),
                    matched_path,
                    some_other_field = tracing::field::Empty,
                )
            }), // .on_request(|_request: &Request<_>, _span: &Span| {
                // You can use `_span.record("some_other_field", value)` in one of these
                // closures to attach a value to the initially empty field in the info_span
                // created above.
                // tracing::debug!("request received");
                // })
                // .on_response(|_response: &Response, _latency: Duration, _span: &Span| {
                // ...
                // tracing::debug!("response sent");
                // })
                // .on_body_chunk(|_chunk: &Bytes, _latency: Duration, _span: &Span| {
                // ...
                // })
                // .on_eos(|_trailers: Option<&HeaderMap>, _stream_duration: Duration, _span: &Span| {
                // ...
                //})
                // .on_failure( |_error: ServerErrorsFailureClass, _latency: Duration, _span: &Span| {
                // ...
                // },
                // ),
        )
        .with_state(Arc::new(printer));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:7070")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn hello_world() -> String {
    "Hello, World!".to_string()
}

async fn print_data(
    State(state): State<Arc<Printer>>,
    Json(payload): Json<serde_json::Value>,
) -> String {
    match state.println(format!("Hello {}!", payload["name"])) {
        Ok(_) => (),
        Err(e) => panic!("Error: {}", e),
    }
    "Successfully printed!".to_string()
}

async fn jira_issue(Json(payload): Json<Issue>) {
    println!("Issue: {:?}", payload);
}
