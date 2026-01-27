import type { BaseResult } from './BaseResult';

export interface NavigationResult extends BaseResult {
    url: string;
    title: string;
}
