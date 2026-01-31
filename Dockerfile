# Stage 1: Builder
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build
# Prune dev dependencies to keep the image small
RUN npm prune --production

# Stage 2: Final
FROM node:20-bookworm-slim

WORKDIR /app

# Install n8n globally
RUN npm install -g n8n

# Install required system dependencies for Playwright
# We install all browsers to ensure full compatibility
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN apt-get update && \
    npx -y playwright@1.58.0 install --with-deps && \
    rm -rf /var/lib/apt/lists/*

# Copy built artifacts and production dependencies from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
