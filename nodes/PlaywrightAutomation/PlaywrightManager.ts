
import { join } from 'path';

import {
    chromium,
    firefox,
    webkit,
    type Browser,
    type BrowserType as PlaywrightBrowserType,
    type Page
} from 'playwright';
import { v4 as uuidv4 } from 'uuid';

import type { BrowserConfiguration } from './types/interfaces/BrowserConfiguration';
import type { BrowserSession } from './types/interfaces/BrowserSession';
import { getBrowserExecutablePath } from './utils';
import { BrowserType } from './types/enums/BrowserType';

// Track which browsers have been verified/installed this session
const verifiedBrowsers = new Map<BrowserType, string>();

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

    async createSession(browserConfiguration: BrowserConfiguration): Promise<BrowserSession> {
        // Ensure browser is installed before attempting to launch
        const executablePath = await this.ensureBrowserInstalled(browserConfiguration.browserType);

        const browserType = this.getBrowserType(browserConfiguration.browserType);

        const launchOptions = {
            headless: browserConfiguration.headless,
            args: browserConfiguration.args,
            proxy: browserConfiguration.proxy,
            timeout: browserConfiguration.timeout,
            executablePath,
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

    /**
     * Ensures the browser is installed before attempting to launch.
     * This uses the custom setup-browsers script and local browsers directory.
     * Returns undefined if using global system browsers (Docker).
     */
    private async ensureBrowserInstalled(browserName: BrowserType): Promise<string | undefined> {
        // If running in official Docker image with global browsers
        if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
            // eslint-disable-next-line no-console
            console.log(`🎭 Playwright: Using global browser for "${browserName}" from ${process.env.PLAYWRIGHT_BROWSERS_PATH}`);
            return undefined;
        }

        // Return cached path if available
        if (verifiedBrowsers.has(browserName)) {
            return verifiedBrowsers.get(browserName)!;
        }

        const browsersPath = join(__dirname, '..', 'browsers');

        try {
            // Try to get browser executable path
            const executablePath = getBrowserExecutablePath(browserName, browsersPath);
            verifiedBrowsers.set(browserName, executablePath);
            return executablePath;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`🎭 Playwright: Browser "${browserName}" not found or path error: ${error.message}. Installing...`);
        }

        // Install the browser
        try {
            // Try again to get the path
            const executablePath = getBrowserExecutablePath(browserName, browsersPath);
            verifiedBrowsers.set(browserName, executablePath);

            // eslint-disable-next-line no-console
            console.log(`✅ Playwright: Browser "${browserName}" installed successfully at ${executablePath}.`);
            return executablePath;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(
                `Failed to install Playwright browser "${browserName}". ` +
                `Error: ${errorMessage}`
            );
        }
    }

    private getBrowserType(type: BrowserType): PlaywrightBrowserType {
        switch (type) {
            case BrowserType.Firefox:
                return firefox;
            case BrowserType.WebKit:
                return webkit;
            default:
                return chromium;
        }
    }
}

