# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1
ENV NODE_ENV development
WORKDIR /usr/src/app

COPY package.json package.json
COPY bun.lockb bun.lockb
COPY vite.config.js vite.config.js
RUN bun install --frozen-lockfile
COPY . .

EXPOSE 5173/tcp
CMD [ "bun", "run", "dev", "--host" ]
