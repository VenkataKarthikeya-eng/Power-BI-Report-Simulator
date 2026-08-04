FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json tsconfig.json ./
COPY packages ./packages
COPY apps/app-dashboard/package.json ./apps/app-dashboard/package.json

RUN npm ci && npm install --no-save @next/swc-linux-x64-musl

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json package-lock.json turbo.json tsconfig.base.json tsconfig.json ./
COPY apps/app-dashboard ./apps/app-dashboard

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build --workspace=@dcaps/app-dashboard

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/app-dashboard ./apps/app-dashboard

USER nextjs

EXPOSE 3001

WORKDIR /app/apps/app-dashboard

CMD ["npx", "next", "start", "-p", "3001"]
