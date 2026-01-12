// use futures::StreamExt;
// use std::str::from_utf8;

use async_nats::ServerAddr;

#[tokio::main]
async fn main() -> Result<(), async_nats::Error> {
    // Connect to the NATS server
    let servers = ["nats://localhost:4222", "nats://localhost:4223"];
    let client = async_nats::connect(
        servers
            .iter()
            .map(|url| url.parse())
            .collect::<Result<Vec<ServerAddr>, _>>()?,
    )
    .await?;

    // Publish messages to the "messages" subject
    for i in 0..10 {
        client
            .publish("messages", format!("data: {}", i).into())
            .await?;
    }

    client.flush().await?;

    Ok(())
}
