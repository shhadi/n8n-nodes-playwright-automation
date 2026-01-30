import { execSync } from 'child_process';
import * as fs from 'fs';

import {
    chromium,
    firefox,
    webkit,
    type Browser,
    type BrowserType,
    type Page
} from 'playwright';
import { v4 as uuidv4 } from 'uuid';

import type { BrowserConfiguration } from './types/interfaces/BrowserConfiguration';
import type { BrowserSession } from './types/interfaces/BrowserSession';

// Track which browsers have been verified/installed this session
const verifiedBrowsers = new Set<string>();

export class PlaywrightManager {
    private static instance: PlaywrightManager | undefined;

    private sessions: Map<string, BrowserSession> = new Map();
    private browsers: Map<string, Browser> = new Map();

    private constructor() {
        // Singleton pattern
    }

    public static getInstance(): PlaywrightManager {
        if (PlaywrightManager.instance === undefined) {
            PlaywrightManager.instance = new PlaywrightManager();
        }
        return PlaywrightManager.instance;
    }

    /**
     * Ensures the browser is installed before attempting to launch.
     * This is the key feature that makes the node work without postinstall scripts.
     */
    private async ensureBrowserInstalled(browserName: string): Promise<void> {
        // Skip if we've already verified this browser in this session
        if (verifiedBrowsers.has(browserName)) {
            return;
        }

        try {
            // Try to get browser executable path - if it throws, browser isn't installed
            const browserType = this.getBrowserType(browserName);
            const executablePath = browserType.executablePath();

            // Check if the executable actually exists
            if (fs.existsSync(executablePath)) {
                verifiedBrowsers.add(browserName);
                return;
            }
        } catch {
            // Browser not installed, continue to install
        }

        // Install the browser
        console.log(`🎭 Playwright: Browser "${browserName}" not found. Installing automatically...`);

        try {
            // Use npx to run playwright install for the specific browser
            execSync(`npx playwright install ${browserName}`, {
                stdio: 'inherit',
                encoding: 'utf-8',
                timeout: 300000, // 5 minute timeout for download
            });

            console.log(`✅ Playwright: Browser "${browserName}" installed successfully.`);
            verifiedBrowsers.add(browserName);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(
                `Failed to install Playwright browser "${browserName}". ` +
                `Please run manually: npx playwright install ${browserName}\n` +
                `Error: ${errorMessage}`
            );
        }
    }

    async createSession(browserConfiguration: BrowserConfiguration): Promise<BrowserSession> {
        // Ensure browser is installed before attempting to launch
        await this.ensureBrowserInstalled(browserConfiguration.browserType);

        const browserType = this.getBrowserType(browserConfiguration.browserType);

        const launchOptions = {
            headless: browserConfiguration.headless,
            args: browserConfiguration.args,
            proxy: browserConfiguration.proxy,
            timeout: browserConfiguration.timeout,
        };

        const browser = await browserType.launch(launchOptions);
        const context = await browser.newContext();
        const page = await context.newPage();

        const sessionId = uuidv4();
        const session: BrowserSession = {
            id: sessionId,
            context,
            page,
            browserType: browserConfiguration.browserType,
        };

        this.browsers.set(sessionId, browser);
        this.sessions.set(sessionId, session);

        return session;
    }

    getSession(sessionId: string): BrowserSession | undefined {
        return this.sessions.get(sessionId);
    }

    getPage(sessionId: string): Page | undefined {
        return this.sessions.get(sessionId)?.page;
    }

    async closeSession(sessionId: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (session) {
            await session.context.close();
            this.sessions.delete(sessionId);
        }

        const browser = this.browsers.get(sessionId);
        if (browser) {
            await browser.close();
            this.browsers.delete(sessionId);
        }
    }

    async closeAll(): Promise<void> {
        for (const browser of this.browsers.values()) {
            await browser.close().catch((): void => {
                // Ignore errors during cleanup
                return;
            });
        }
        this.sessions.clear();
        this.browsers.clear();
    }

    private getBrowserType(type: string): BrowserType {
        switch (type) {
            case 'firefox':
                return firefox;
            case 'webkit':
                return webkit;
            default:
                return chromium;
        }
    }
}
