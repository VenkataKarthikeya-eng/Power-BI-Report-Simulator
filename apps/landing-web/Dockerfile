FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json tsconfig.json ./
COPY packages ./packages
COPY apps/landing-web/package.json ./apps/landing-web/package.json

RUN npm ci && npm install --no-save @next/swc-linux-x64-musl

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json package-lock.json turbo.json tsconfig.base.json tsconfig.json ./
COPY apps/landing-web ./apps/landing-web

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build --workspace=@dcaps/landing-web

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/landing-web ./apps/landing-web

USER nextjs

EXPOSE 3000

WORKDIR /app/apps/landing-web

CMD ["npx", "next", "start", "-p", "3000"]
