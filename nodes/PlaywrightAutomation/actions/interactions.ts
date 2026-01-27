import type { Page } from 'playwright';

import { PageOperation, WaitType, type InteractionResult } from '../types';

export async function click(page: Page, selector: string): Promise<InteractionResult> {
    await page.click(selector);
    return {
        success: true,
        action: PageOperation.Click,
        selector,
    };
}

export async function type(page: Page, selector: string, text: string): Promise<InteractionResult> {
    await page.fill(selector, text);
    return {
        success: true,
        action: PageOperation.Fill,
        selector,
        value: text,
    };
}

export async function wait(page: Page, waitType: WaitType, value: string | number): Promise<InteractionResult> {
    if (waitType === WaitType.Time) {
        const ms = typeof value === 'string' ? parseInt(value) : value;
        await page.waitForTimeout(ms);
        return { success: true, action: PageOperation.Wait, type: WaitType.Time, ms };
    } else {
        await page.waitForSelector(value as string);
        return { success: true, action: PageOperation.Wait, type: WaitType.Selector, selector: value as string };
    }
}
