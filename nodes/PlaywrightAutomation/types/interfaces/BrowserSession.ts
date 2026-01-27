import type { BrowserContext, Page } from 'playwright';

import type { BrowserType } from '../enums/BrowserType';

export interface BrowserSession {
	id: string;
	context: BrowserContext;
	page: Page;
	browserType: BrowserType;
}
