FROM node:24.1.0-bullseye-slim

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8000

CMD ["pnpm", "start"]
