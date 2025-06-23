FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Add OpenSSL for Prisma with specific version support
RUN apk add --no-cache libc6-compat openssl openssl-dev

# Create symlinks for libssl and libcrypto to support Prisma
RUN mkdir -p /lib
RUN ln -s /usr/lib/libssl.so /lib/libssl.so.1.1
RUN ln -s /usr/lib/libcrypto.so /lib/libcrypto.so.1.1

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Copy scripts and prisma directories for postinstall script
COPY scripts ./scripts/
COPY prisma ./prisma/
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install OpenSSL for Prisma in production with symlinks
RUN apk add --no-cache openssl openssl-dev
RUN mkdir -p /lib
RUN ln -s /usr/lib/libssl.so /lib/libssl.so.1.1
RUN ln -s /usr/lib/libcrypto.so /lib/libcrypto.so.1.1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["npm", "start"] 