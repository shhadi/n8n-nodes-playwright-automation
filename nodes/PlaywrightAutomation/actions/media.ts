import type { Page } from 'playwright';

export async function takeScreenshot(page: Page, fullPage = false): Promise<Buffer> {
	return await page.screenshot({ fullPage });
}

export async function generatePDF(page: Page): Promise<Buffer> {
	return await page.pdf({ format: 'A4' });
}
