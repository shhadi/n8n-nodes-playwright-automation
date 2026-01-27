import type { BaseResult } from './BaseResult';

export interface InteractionResult extends BaseResult {
    value?: string;
    type?: string;
    ms?: number;
}
