import {
	chromium,
	firefox,
	webkit,
	type Browser,
	type BrowserType,
	type Page } from 'playwright';
import { v4 as uuidv4 } from 'uuid';

import type { BrowserConfiguration } from './types/interfaces/BrowserConfiguration';
import type { BrowserSession } from './types/interfaces/BrowserSession';



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
