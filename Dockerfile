FROM node:22-bookworm

WORKDIR /app

# Install n8n globally
RUN npm install -g n8n

# Copy package files and scripts (scripts needed for postinstall)
COPY package.json package-lock.json ./
COPY scripts ./scripts/

# Install dependencies
RUN npm install

# Install Playwright dependencies (Debian-based)
#RUN npx playwright install-deps
#RUN npx playwright install chromium

# Copy source code
COPY . .

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
