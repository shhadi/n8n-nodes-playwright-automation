import type { Page } from 'playwright';

import { PageOperation, type ExtractionResult } from '../types';

export async function getText(page: Page, selector: string): Promise<ExtractionResult> {
    const text = await page.textContent(selector);
    return {
        success: true,
        action: PageOperation.GetText,
        selector,
        text,
    };
}

export async function getHTML(page: Page, selector?: string): Promise<ExtractionResult> {
    let html;
    if (selector !== undefined) {
        html = await page.innerHTML(selector);
    } else {
        html = await page.content();
    }
    return {
        success: true,
        action: PageOperation.GetHTML,
        selector,
        html,
    };
}

export async function getAttribute(page: Page, selector: string, attribute: string): Promise<ExtractionResult> {
    const value = await page.getAttribute(selector, attribute);
    return {
        success: true,
        action: PageOperation.GetAttribute,
        selector,
        attribute,
        value,
    };
}

export async function countElements(page: Page, selector: string): Promise<ExtractionResult> {
    const count = await page.locator(selector).count();
    return {
        success: true,
        action: PageOperation.Count,
        selector,
        count,
    };
}
