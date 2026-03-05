#!/bin/sh
set -e

echo "Linking node..."
mkdir -p /root/.n8n/custom/node_modules
# Remove if exists (to be safe)
rm -rf /root/.n8n/custom/node_modules/n8n-nodes-playwright-automation
# Link the app directory
ln -s /app /root/.n8n/custom/node_modules/n8n-nodes-playwright-automation

echo "Starting n8n..."
# Ensure n8n uses the custom modules
export N8N_CUSTOM_EXTENSIONS=/root/.n8n/custom/node_modules
exec n8n start
