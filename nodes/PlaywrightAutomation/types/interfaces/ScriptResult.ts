import type { BaseResult } from './BaseResult';

export interface ScriptResult extends BaseResult {
    returnValue: unknown;
    executionTimeMs: number;
}
