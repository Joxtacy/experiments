const server = Bun.serve({
  port: 3000,
  fetch(_request) {
    return new Response("Welcome to Bunnnnnn!");
  },
});

console.log(`Listening on ${server.url}`);

