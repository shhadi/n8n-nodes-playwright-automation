import type { BrowserType } from '../enums/BrowserType';

export interface BrowserConfiguration {
	headless: boolean;
	browserType: BrowserType;
	args?: string[];
	proxy?: {
		server: string;
		username?: string;
		password?: string;
	};
	timeout?: number;
}
