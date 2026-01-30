FROM mcr.microsoft.com/playwright:v1.58.0-noble

WORKDIR /app



# Install n8n globally
RUN npm install -g n8n

# Copy package files and scripts (scripts needed for postinstall)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
