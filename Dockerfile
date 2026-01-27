FROM n8nio/n8n:latest

USER root

# Install Playwright and dependencies
RUN npm install -g playwright
RUN npx playwright install-deps
RUN npx playwright install chromium

USER node
