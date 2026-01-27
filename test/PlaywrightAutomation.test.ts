import * as fs from 'fs';
import * as path from 'path';

import type { Page } from 'playwright';
import { afterAll, describe, expect, it } from 'vitest';

import { getText } from '../nodes/PlaywrightAutomation/actions/extract';
import { takeScreenshot } from '../nodes/PlaywrightAutomation/actions/media';
import { navigate } from '../nodes/PlaywrightAutomation/actions/navigate';
import { PlaywrightManager } from '../nodes/PlaywrightAutomation/PlaywrightManager';
import { BrowserType } from '../nodes/PlaywrightAutomation/types';

describe('Playwright Automation Node Logic', () => {
	const manager = PlaywrightManager.getInstance();
	let sessionId: string;
	let page: Page;

	afterAll(async () => {
		if (sessionId) {
			await manager.closeSession(sessionId);
		}
	});

	it('should create a session', async () => {
		const session = await manager.createSession({
			browserType: BrowserType.Chromium,
			headless: true,
		});
		expect(session).toBeDefined();
		expect(session.id).toBeDefined();
		expect(session.page).toBeDefined();
		sessionId = session.id;
		page = session.page;
	});

	it('should navigate to example.com', async () => {
		const result = await navigate(page, 'http://example.com');
		expect(result.success).toBe(true);
		expect(result.url).toContain('example.com');
	});

	it('should get header text', async () => {
		const result = await getText(page, 'h1');
		expect(result.success).toBe(true);
		expect(result.text).toBe('Example Domain');
	});

	it('should take a screenshot', async () => {
		const buffer = await takeScreenshot(page);
		expect(Buffer.isBuffer(buffer)).toBe(true);
		expect(buffer.length).toBeGreaterThan(0);

		// Save it for manual inspection if needed
		fs.writeFileSync(path.join(__dirname, 'evidence-screenshot.png'), buffer);
	});
});
