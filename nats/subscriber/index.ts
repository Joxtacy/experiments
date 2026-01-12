import { connect } from "@nats-io/transport-node";

const nc = await connect({
	name: "testing-with-bun",
	servers: [
		"nats://localhost:4222",
		"nats://localhost:4223",
	],
});

// here's an iterator subscription - note the code in the
// for loop will block until the iterator completes
// either from a break/return from the iterator, an
// unsubscribe after the message arrives, or in this case
// an auto-unsubscribe after the first message is received
// https://github.com/nats-io/nats.js/blob/master/README.md#async-vs-callbacks
const sub = nc.subscribe("messages");
for await (const m of sub) {
	console.log(`[${sub.getProcessed()}]: ${m.string()}`);
}

// subscriptions have notifications, simply wait
// the closed promise
sub.closed
	.then(() => {
		console.log("subscription closed");
	})
	.catch((err) => {
		console.error(`subscription closed with an error ${err.message}`);
	});

// When done close it
await nc.close();
