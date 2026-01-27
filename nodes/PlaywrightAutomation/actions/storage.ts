import type { BrowserContext } from 'playwright';

import type { SessionResult, BaseResult } from '../types';

type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>;

export async function getStorageState(context: BrowserContext): Promise<SessionResult> {
    const state = await context.storageState();
    return {
        success: true,
        state,
    };
}

export async function setStorageState(context: BrowserContext, state: StorageState): Promise<BaseResult> {
    // Note: context.addCookies / addInitScript might be needed if context is already created.
    // Playwright recommends setting storageState at context creation.
    // But we can add cookies on the fly.

    // However, n8n V1.0 plan said "Storage state export/import".
    // If we want to import, we might need to handle it.
    // For now, let's just support returning the JSON.
    // Setting it on an existing context is tricky for things like localStorage which need 'addInitScript' or run script.
    // Cookies are easy: context.addCookies(state.cookies).

    if (Array.isArray(state.cookies)) {
        await context.addCookies(state.cookies as Array<{ name: string; value: string; url?: string; domain?: string; path?: string; expires?: number; httpOnly?: boolean; secure?: boolean; sameSite?: "Strict" | "Lax" | "None"; }>);
    }

    // For localStorage, we might need to inject script.
    if (state.origins !== undefined) {
        // This is complex for existing pages.
        // It works best if we do it before page creation.
        // But our session is long lived.
        // Best approach: "Load Storage State" operation -> Adds cookies.
        // Warn user about LocalStorage only applying to new pages or needing reload?
    }

    return { success: true };
}
