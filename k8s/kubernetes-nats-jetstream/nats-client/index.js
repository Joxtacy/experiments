const { connect, StringCodec } = require('nats');

async function run() {
  try {
    // Connect to the NATS server
    console.log("Connecting to NATS server...");
    const nc = await connect({ servers: "nats://localhost:4222" });
    console.log("Connected to NATS server.");

    // Create a codec
    const sc = StringCodec();

        // Subscribe to the subject
        console.log("Subscribing to subject...");
        const sub = nc.subscribe("test.subject");
        
    // Publish a message
    console.log("Publishing message...");
    nc.publish("test.subject", sc.encode("Hello, NATS JetStream!"));
    console.log("Message published.");


    for await (const msg of sub) {
      console.log(`Received message: ${sc.decode(msg.data)}`);
    }

    // Close the connection
    await nc.drain();
    console.log("Connection closed.");
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

run();