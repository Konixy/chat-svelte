FROM oven/bun:1.2.4-alpine AS chat-svelte

LABEL Developpers="Anatole Dufour"

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN bun run prisma:generate
RUN bun run build

RUN rm -rf src/ static/ docker-compose.yml

USER bun:bun

CMD ["bun", "./build"]
