import type { BaseResult } from './BaseResult';

export interface MediaResult extends BaseResult {
    // Media actions (screenshot, pdf) return binary data or specific success object
    binary?: Buffer;
}
