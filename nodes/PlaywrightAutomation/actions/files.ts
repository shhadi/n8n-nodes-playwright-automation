import type { Page } from 'playwright';

import { PageOperation, type FileResult } from '../types';

export async function uploadFile(page: Page, selector: string, files: string[] | Array<{ name: string, mimeType: string, buffer: Buffer }>): Promise<FileResult> {
    await page.setInputFiles(selector, files);
    return {
        success: true,
        action: PageOperation.Upload,
        selector,
        filesCount: files.length,
    };
}
