FROM imbios/bun-node:latest-23-alpine AS chat-svelte

LABEL Developpers="Anatole Dufour"

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN bun run prisma:generate
RUN bun run build

RUN rm -rf docker-compose.yml

USER bun:bun

CMD ["bun", "./build"]
