import type { INodeProperties } from 'n8n-workflow';

import { ResourceType, SessionOperation, BrowserType, PageOperation, ScriptOperation, WaitType } from './types';

export const playwrightNodeProperties: INodeProperties[] = [
    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        default: ResourceType.Session.valueOf(),
        noDataExpression: true,
        options: [
            {
                name: 'Session',
                value: ResourceType.Session,
            },
            {
                name: 'Page',
                value: ResourceType.Page,
            },
            {
                name: 'Script',
                value: ResourceType.Script,
            },
        ],
    },
    // ----------------------------------
    //         Session Operations
    // ----------------------------------
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        default: SessionOperation.Create.valueOf(),
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Session],
            },
        },
        options: [
            { name: 'Create', value: SessionOperation.Create, description: 'Create a new browser session', action: 'Create a session' },
            { name: 'Close', value: SessionOperation.Close, description: 'Close a browser session', action: 'Close a session' },
            { name: 'Get Storage State', value: SessionOperation.GetStorageState, description: 'Get cookies and local storage', action: 'Get storage state' },
        ],
    },
    {
        displayName: 'Browser Type',
        name: 'browserType',
        type: 'options',
        default: BrowserType.Chromium.valueOf(),
        options: [
            { name: 'Chromium', value: BrowserType.Chromium },
            { name: 'Firefox', value: BrowserType.Firefox },
            { name: 'WebKit', value: BrowserType.WebKit },
        ],
        displayOptions: {
            show: {
                resource: [ResourceType.Session],
                operation: [SessionOperation.Create],
            },
        },
    },
    {
        displayName: 'Headless',
        name: 'headless',
        type: 'boolean',
        default: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Session],
                operation: [SessionOperation.Create],
            },
        },
    },
    {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Session],
                operation: [SessionOperation.Close, SessionOperation.GetStorageState],
            },
        },
    },

    // ----------------------------------
    //           Page Operations
    // ----------------------------------
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        default: PageOperation.Navigate.valueOf(),
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
            },
        },
        options: [
            { name: 'Navigate', value: PageOperation.Navigate, description: 'Navigate to a URL', action: 'Navigate to a url' },
            { name: 'Click', value: PageOperation.Click, description: 'Click an element', action: 'Click an element' },
            { name: 'Type/Fill', value: PageOperation.Fill, description: 'Type into an input field', action: 'Type into an element' },
            { name: 'Wait', value: PageOperation.Wait, description: 'Wait for time or selector', action: 'Wait' },
            { name: 'Get Text', value: PageOperation.GetText, description: 'Get element text content', action: 'Get text' },
            { name: 'Get HTML', value: PageOperation.GetHTML, description: 'Get element or page HTML', action: 'Get html' },
            { name: 'Get Attribute', value: PageOperation.GetAttribute, description: 'Get element attribute', action: 'Get attribute' },
            { name: 'Count Elements', value: PageOperation.Count, description: 'Count matching elements', action: 'Count elements' },
            { name: 'Screenshot', value: PageOperation.Screenshot, description: 'Take a screenshot', action: 'Take a screenshot' },
            { name: 'PDF', value: PageOperation.PDF, description: 'Generate PDF', action: 'Generate pdf' },
            { name: 'Upload File', value: PageOperation.Upload, description: 'Upload a file to an input', action: 'Upload a file' },
        ],
    },

    // ----------------------------------
    //         Script Operations
    // ----------------------------------
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        default: ScriptOperation.Run.valueOf(),
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Script],
            },
        },
        options: [
            { name: 'Run Script', value: ScriptOperation.Run, description: 'Run a custom Playwright script', action: 'Run a custom script' },
        ],
    },
    {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Script],
            },
        },
    },
    {
        displayName: 'Script Code',
        name: 'scriptCode',
        type: 'string',
        typeOptions: {
            rows: 10,
        },
        default: '// Access page and context objects\n// Example: const title = await page.title();\n// Return a value to include in output\nreturn { success: true };',
        required: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Script],
                operation: [ScriptOperation.Run],
            },
        },
        description: 'Custom JavaScript code to execute. Has access to "page" and "context" objects.',
    },
    {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
            },
        },
    },
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [PageOperation.Navigate],
            },
        },
    },
    {
        displayName: 'Selector',
        name: 'selector',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [
                    PageOperation.Click,
                    PageOperation.Fill,
                    PageOperation.Wait,
                    PageOperation.GetText,
                    PageOperation.GetHTML,
                    PageOperation.GetAttribute,
                    PageOperation.Count,
                    PageOperation.Upload
                ],
            },
        },
        description: 'CSS or XPath selector',
    },
    {
        displayName: 'Value',
        name: 'value',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [PageOperation.Fill],
            },
        },
    },
    {
        displayName: 'Input Binary Field',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [PageOperation.Upload],
            },
        },
        description: 'Name of the binary property containing the file to upload',
    },
    {
        displayName: 'Attribute Name',
        name: 'attributeName',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [PageOperation.GetAttribute],
            },
        },
    },
    {
        displayName: 'Full Page',
        name: 'fullPage',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [PageOperation.Screenshot],
            },
        },
    },

    // Wait Options
    {
        displayName: 'Wait Type',
        name: 'waitType',
        type: 'options',
        default: WaitType.Selector.valueOf(),
        options: [
            { name: 'Time (Ms)', value: WaitType.Time },
            { name: 'Selector', value: WaitType.Selector },
        ],
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [PageOperation.Wait],
            },
        },
    },
    {
        displayName: 'Time (Ms)',
        name: 'waitTime',
        type: 'number',
        default: 1000,
        displayOptions: {
            show: {
                resource: [ResourceType.Page],
                operation: [PageOperation.Wait],
                waitType: [WaitType.Time],
            },
        },
    },

    // Error Handling
    {
        displayName: 'Error Handling',
        name: 'errorHandling',
        type: 'hidden',
        default: '',
    },
    {
        displayName: 'Screenshot on Fail',
        name: 'screenshotOnFail',
        type: 'boolean',
        default: false,
        description: 'Whether to take a screenshot if the operation fails and attach it to the error',
    },
];
