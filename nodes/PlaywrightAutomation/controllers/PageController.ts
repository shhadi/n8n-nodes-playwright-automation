import { NodeOperationError, type IDataObject, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';

import { getText, getHTML, getAttribute, countElements } from '../actions/extract';
import { uploadFile } from '../actions/files';
import { click, type, wait } from '../actions/interactions';
import { takeScreenshot, generatePDF } from '../actions/media';
import { navigate } from '../actions/navigate';
import { PlaywrightManager } from '../PlaywrightManager';
import { PageOperation, WaitType, type ActionResult } from '../types';

import { type IController } from './IController';

export class PageController implements IController {
    async execute(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData> {
        const operation = executeFunctions.getNodeParameter('operation', itemIndex) as PageOperation;
        const manager = PlaywrightManager.getInstance();

        const sessionId = executeFunctions.getNodeParameter('sessionId', itemIndex) as string;
        const session = manager.getSession(sessionId);

        if (!session) {
            throw new NodeOperationError(executeFunctions.getNode(), `Session ${sessionId} not found`, { itemIndex });
        }

        const page = session.page;

        let result: ActionResult | undefined;

        switch (operation) {
            case PageOperation.Navigate:
                result = await navigate(page, executeFunctions.getNodeParameter('url', itemIndex) as string);
                break;
            case PageOperation.Click:
                result = await click(page, executeFunctions.getNodeParameter('selector', itemIndex) as string);
                break;
            case PageOperation.Fill:
                result = await type(page, executeFunctions.getNodeParameter('selector', itemIndex) as string, executeFunctions.getNodeParameter('value', itemIndex) as string);
                break;
            case PageOperation.Wait: {
                const waitType = executeFunctions.getNodeParameter('waitType', itemIndex) as WaitType;
                if (waitType === WaitType.Time) {
                    result = await wait(page, WaitType.Time, executeFunctions.getNodeParameter('waitTime', itemIndex) as number);
                } else {
                    result = await wait(page, WaitType.Selector, executeFunctions.getNodeParameter('selector', itemIndex) as string);
                }
                break;
            }
            case PageOperation.GetText:
                result = await getText(page, executeFunctions.getNodeParameter('selector', itemIndex) as string);
                break;
            case PageOperation.GetHTML:
                result = await getHTML(page, executeFunctions.getNodeParameter('selector', itemIndex) as string);
                break;
            case PageOperation.GetAttribute:
                result = await getAttribute(page, executeFunctions.getNodeParameter('selector', itemIndex) as string, executeFunctions.getNodeParameter('attributeName', itemIndex) as string);
                break;
            case PageOperation.Count:
                result = await countElements(page, executeFunctions.getNodeParameter('selector', itemIndex) as string);
                break;
            case PageOperation.Screenshot: {
                const fullPage = executeFunctions.getNodeParameter('fullPage', itemIndex) as boolean;
                const buffer = await takeScreenshot(page, fullPage);
                const binaryData = await executeFunctions.helpers.prepareBinaryData(buffer, 'screenshot.png', 'image/png');
                return {
                    json: { success: true, action: PageOperation.Screenshot },
                    binary: { data: binaryData },
                    pairedItem: itemIndex,
                };
            }
            case PageOperation.PDF: {
                const buffer = await generatePDF(page);
                const binaryData = await executeFunctions.helpers.prepareBinaryData(buffer, 'document.pdf', 'application/pdf');
                return {
                    json: { success: true, action: PageOperation.PDF },
                    binary: { data: binaryData },
                    pairedItem: itemIndex,
                };
            }
            case PageOperation.Upload: {
                const binaryPropertyName = executeFunctions.getNodeParameter('binaryPropertyName', itemIndex);
                const binaryData = executeFunctions.helpers.assertBinaryData(itemIndex, binaryPropertyName);
                const buffer = await executeFunctions.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
                const file = {
                    name: binaryData.fileName ?? 'upload.bin',
                    mimeType: binaryData.mimeType,
                    buffer,
                };
                result = await uploadFile(page, executeFunctions.getNodeParameter('selector', itemIndex) as string, [file]);
                break;
            }
            default:
                throw new NodeOperationError(executeFunctions.getNode(), `Operation ${operation} not supported for Page resource`, { itemIndex });
        }

        return {
            json: result as unknown as IDataObject,
            pairedItem: itemIndex,
        };
    }
}
