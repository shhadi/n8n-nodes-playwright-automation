import type { Page } from 'playwright';

export async function takeScreenshot(page: Page, fullPage = false): Promise<Buffer> {
	return await page.screenshot({ fullPage });
}

export async function generatePDF(
	page: Page,
	options: { landscape?: boolean; format?: string; printBackground?: boolean } = {},
): Promise<Buffer> {
	const { landscape = false, format = 'A4', printBackground = false } = options;
	return await page.pdf({ format, landscape, printBackground });
}
