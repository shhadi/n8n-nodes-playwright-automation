import type { BaseResult } from './BaseResult';

export interface ExtractionResult extends BaseResult {
    text?: string | null;
    html?: string;
    value?: string | null;
    count?: number;
    attribute?: string;
}
