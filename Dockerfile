# ---------- deps ----------
FROM oven/bun:1-slim AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile


# ---------- builder ----------
FROM oven/bun:1-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# IMPORTANT: build must NOT touch DB
RUN bun run build


# ---------- runner ----------
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && \
    apt-get install -y ca-certificates curl --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN chown -R nextjs:nextjs /app

USER nextjs
EXPOSE 3000

CMD ["bun", "run", "start"]
