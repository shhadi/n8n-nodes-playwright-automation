import type { BrowserContext } from 'playwright';

import type { BrowserType } from '../enums/BrowserType';

import type { BaseResult } from './BaseResult';

type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>;

export interface SessionResult extends BaseResult {
    sessionId?: string;
    browserType?: BrowserType;
    state?: StorageState; // Playwright storage state type
}
