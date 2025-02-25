FROM node:23.6-alpine AS chat-svelte

LABEL Developpers="Anatole Dufour"

WORKDIR /app

COPY .env.prod .env

COPY . .

RUN npm ci

RUN npm run prisma
RUN npm run build

RUN rm -rf src/ static/ docker-compose.yml

USER node:node

CMD ["node", "build"]
