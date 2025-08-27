FROM node:22-alpine AS base

RUN corepack enable pnpm

WORKDIR /app

COPY pnpm-lock.yaml .
RUN pnpm fetch

FROM base as build

COPY . .
RUN pnpm install -r --offline

COPY .env.build .env

RUN pnpm build

FROM base as prod-deps

COPY package.json .
RUN pnpm install -r --offline --prod

FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY --from=prod-deps /app/node_modules /node_modules
COPY --from=build /app/build .

COPY .env.build .env

ENV PORT=3000
ENV BODY_SIZE_LIMIT=52428800

EXPOSE 3000/tcp

CMD node -r dotenv/config .
