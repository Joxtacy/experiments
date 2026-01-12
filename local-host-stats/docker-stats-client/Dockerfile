FROM rust:1.86 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y tini docker.io ca-certificates libssl-dev && apt-get clean

# tini - https://github.com/krallin/tini
COPY --from=builder /app/target/release/docker-stats-client /usr/local/bin/docker-stats-client

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["docker-stats-client"]
