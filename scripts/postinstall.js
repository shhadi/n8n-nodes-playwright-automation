#!/usr/bin/env node

/**
 * Playwright Environment Setup Script
 * 
 * This script runs automatically after npm install to:
 * 1. Install required system dependencies for Playwright (Linux only)
 * 2. Download Chromium browser binaries
 * 
 * This ensures the n8n-nodes-playwright-automation node works out of the box
 * on cloud servers and self-hosted environments.
 */

const { execSync } = require('child_process');
const { platform } = require('os');

const os = platform();

console.log('\n🎭 n8n-nodes-playwright-automation: Setting up browser environment...\n');

/**
 * Install system dependencies on Linux
 */
function installSystemDependencies() {
    if (os !== 'linux') {
        console.log(`ℹ️  Skipping system dependencies (not Linux - detected: ${os})`);
        return true;
    }

    console.log('🐧 Linux detected - installing system dependencies...');

    try {
        // Check if running as root
        const isRoot = process.getuid && process.getuid() === 0;

        if (!isRoot) {
            console.log('⚠️  Not running as root. Attempting with available permissions...');
        }

        // Use Playwright's built-in dependency installer
        execSync('npx playwright install-deps chromium', {
            stdio: 'inherit',
            encoding: 'utf-8'
        });

        console.log('✅ System dependencies installed successfully');
        return true;
    } catch (error) {
        console.warn('⚠️  Could not install system dependencies automatically.');
        console.warn('   You may need to run manually: npx playwright install-deps');
        console.warn('   Error:', error.message);
        return false;
    }
}

/**
 * Download Chromium browser
 */
function installBrowser() {
    console.log('📥 Downloading Chromium browser...');

    try {
        execSync('npx playwright install chromium', {
            stdio: 'inherit',
            encoding: 'utf-8'
        });

        console.log('✅ Chromium browser installed successfully');
        return true;
    } catch (error) {
        console.warn('⚠️  Could not install Chromium automatically.');
        console.warn('   You may need to run manually: npx playwright install chromium');
        console.warn('   Error:', error.message);
        return false;
    }
}

/**
 * Main setup function
 */
async function setup() {
    try {
        // Step 1: Install system dependencies (Linux only)
        installSystemDependencies();

        // Step 2: Install Chromium browser
        installBrowser();

        console.log('\n✅ Browser environment setup complete!\n');
        console.log('🚀 You can now use the Playwright Automation node in n8n.\n');
    } catch (error) {
        console.error('\n❌ Error during browser setup:', error.message);
        console.error('   The node may not work correctly until dependencies are installed.');
        console.error('   Try running manually:');
        console.error('     npx playwright install-deps  (Linux only)');
        console.error('     npx playwright install chromium\n');
        // Don't exit with error code - allow npm install to complete
    }
}

// Run setup
setup();
