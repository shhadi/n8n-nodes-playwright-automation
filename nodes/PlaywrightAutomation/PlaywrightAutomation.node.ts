import {
	NodeConnectionTypes,
	NodeOperationError,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

import { takeScreenshot } from './actions/media';
import { type IController } from './controllers/IController';
import { PageController } from './controllers/PageController';
import { ScriptController } from './controllers/ScriptController';
import { SessionController } from './controllers/SessionController';
import { playwrightNodeProperties } from './PlaywrightAutomation.properties';
import { PlaywrightManager } from './PlaywrightManager';
import { ResourceType } from './types';


export class PlaywrightAutomation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Playwright Automation',
		name: 'playwrightAutomation',
		icon: { light: 'file:playwright-automation.svg', dark: 'file:playwright-automation.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Playwright Automation for n8n',
		defaults: {
			name: 'Playwright Automation',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: playwrightNodeProperties,
		usableAsTool: undefined,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const manager = PlaywrightManager.getInstance();

		const controllers: Record<ResourceType, IController> = {
			[ResourceType.Session]: new SessionController(),
			[ResourceType.Page]: new PageController(),
			[ResourceType.Script]: new ScriptController(),
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as ResourceType;
				// eslint-disable-next-line security/detect-object-injection
				const controller = controllers[resource];

				// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
				if (!controller) {
					throw new NodeOperationError(this.getNode(), `Unknown resource type: ${resource}`, { itemIndex: i });
				}

				const result = await controller.execute(this, i);
				returnData.push(result);

			} catch (error) {
				const screenshotOnFail = this.getNodeParameter('screenshotOnFail', i, false) as boolean;
				let errorBinaryData;

				if (screenshotOnFail) {
					try {
						// eslint-disable-next-line security/detect-object-injection
						const sessionId = (items[i].json.sessionId as string) || this.getNodeParameter('sessionId', i, '') as string;
						if (sessionId) {
							const session = manager.getSession(sessionId);
							if (session?.page) {
								const buffer = await takeScreenshot(session.page);
								errorBinaryData = await this.helpers.prepareBinaryData(buffer, 'error_screenshot.png', 'image/png');
							}
						}
					} catch {
						// Ignore screenshot error
					}
				}

				const errorData: INodeExecutionData = {
					json: { error: error.message },
					pairedItem: i
				};

				if (errorBinaryData) {
					errorData.binary = { errorScreenshot: errorBinaryData };
				}

				if (this.continueOnFail()) {
					returnData.push(errorData);
				} else {

					// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
					if (error instanceof NodeOperationError || error.context) {
						// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
						if (error.context) {
							error.context.itemIndex = i;
						}
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
