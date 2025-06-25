FROM node:18-alpine AS base

# Install dependencies needed for Prisma
RUN apk add --no-cache libc6-compat openssl

# Create symlinks for OpenSSL libraries if they don't exist
RUN mkdir -p /lib \
    && if [ ! -e /lib/libssl.so.1.1 ] && [ -e /usr/lib/libssl.so ]; then ln -s /usr/lib/libssl.so /lib/libssl.so.1.1; fi \
    && if [ ! -e /lib/libcrypto.so.1.1 ] && [ -e /usr/lib/libcrypto.so ]; then ln -s /usr/lib/libcrypto.so /lib/libcrypto.so.1.1; fi

# Install dependencies
FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
# Copy scripts directory needed for postinstall
COPY scripts ./scripts
# Copy prisma directory needed for prisma generate
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app

# Copy files needed for build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NODE_ENV production
ENV PRISMA_SKIP_LIBSSL_COPY 1

# Build the app
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV PRISMA_SKIP_LIBSSL_COPY 1

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Set proper ownership
RUN chown -R nextjs:nodejs /app

# Use the non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"] 