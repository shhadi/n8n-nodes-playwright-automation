import type { BrowserContext, Page } from 'playwright';

import type { ScriptResult } from '../types';

export async function runScript(
    page: Page,
    context: BrowserContext,
    scriptCode: string,
): Promise<ScriptResult> {
    const startTime = Date.now();

    // Create async function from code that receives page and context
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const asyncFn = new Function('page', 'context',
        `return (async () => { ${scriptCode} })();`
    ) as (page: Page, context: BrowserContext) => Promise<unknown>;

    const returnValue = await asyncFn(page, context);

    return {
        success: true,
        action: 'runScript',
        returnValue,
        executionTimeMs: Date.now() - startTime,
    };
}
