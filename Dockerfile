FROM node:22-bookworm

WORKDIR /app

# Install n8n globally so n8n-node CLI can use it if needed, 
# although n8n-node dev usually handles things. 
# Installing n8n globally is useful for 'n8n start' context if needed.
RUN npm install -g n8n

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies including devDependencies (needed for build and dev)
RUN npm install

# Install Playwright dependencies
RUN npx playwright install-deps
RUN npx playwright install chromium

# Copy source code
COPY . .

# Run dev server
CMD ["npm", "run", "dev"]
