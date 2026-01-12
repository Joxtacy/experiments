# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1
WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lockb ./
COPY src ./src
COPY *.js ./
COPY *.json ./

RUN bun install

EXPOSE 5173

ENTRYPOINT [ "bun", "--bun", "run", "dev", "--host" ]
