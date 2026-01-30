import { BrowserType } from './types/enums/BrowserType';

export interface BrowserPaths {
    [BrowserType.Chromium]: {
        windows: string[];
        linux: string[];
        darwin: string[];
    };
    [BrowserType.Firefox]: {
        windows: string[];
        linux: string[];
        darwin: string[];
    };
    [BrowserType.WebKit]: {
        windows: string[];
        linux: string[];
        darwin: string[];
    };
}


export { BrowserType };

export const browserPaths: BrowserPaths = {
    [BrowserType.Chromium]: {
        windows: ['chrome-win', 'chrome.exe'],
        linux: ['chrome-linux64', 'chrome'],
        darwin: ['chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium']
    },
    [BrowserType.Firefox]: {
        windows: ['firefox', 'firefox.exe'],
        linux: ['firefox', 'firefox'],
        darwin: ['firefox', 'Firefox.app', 'Contents', 'MacOS', 'firefox']
    },
    [BrowserType.WebKit]: {
        windows: ['webkit-*', 'Playwright.exe'],
        linux: ['webkit-*', 'minibrowser-gtk', 'pw_run.sh'],
        darwin: ['webkit-*', 'Playwright.app', 'Contents', 'MacOS', 'Playwright']
    }
};
