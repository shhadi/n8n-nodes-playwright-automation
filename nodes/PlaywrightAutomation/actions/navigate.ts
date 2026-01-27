import type { Page } from 'playwright';

import type { NavigationResult } from '../types';

export async function navigate(page: Page, url: string): Promise<NavigationResult> {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return {
        success: true,
        url: page.url(),
        title: await page.title(),
    };
}
