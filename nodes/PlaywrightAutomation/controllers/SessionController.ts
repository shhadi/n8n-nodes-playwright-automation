import { NodeOperationError, type IDataObject, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';

import { getStorageState } from '../actions/storage';
import { PlaywrightManager } from '../PlaywrightManager';
import { SessionOperation, type ActionResult, type BrowserType } from '../types';

import { type IController } from './IController';

export class SessionController implements IController {
    async execute(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData> {
        const operation = executeFunctions.getNodeParameter('operation', itemIndex) as SessionOperation;
        const manager = PlaywrightManager.getInstance();
        let result: ActionResult;

        if (operation === SessionOperation.Create) {
            const browserType = executeFunctions.getNodeParameter('browserType', itemIndex) as BrowserType;
            const headless = executeFunctions.getNodeParameter('headless', itemIndex) as boolean;
            const session = await manager.createSession({ browserType, headless });
            result = {
                success: true,
                sessionId: session.id,
                browserType: session.browserType,
            } as ActionResult;
        } else if (operation === SessionOperation.Close) {
            const sessionId = executeFunctions.getNodeParameter('sessionId', itemIndex) as string;
            await manager.closeSession(sessionId);
            result = { success: true, sessionId } as ActionResult;
        } else if (operation === SessionOperation.GetStorageState) {
            const sessionId = executeFunctions.getNodeParameter('sessionId', itemIndex) as string;
            const session = manager.getSession(sessionId);
            if (!session) {
                throw new NodeOperationError(executeFunctions.getNode(), `Session ${sessionId} not found`, { itemIndex });
            }
            result = await getStorageState(session.context);
        } else {
            throw new NodeOperationError(executeFunctions.getNode(), `Operation ${operation} not supported for Session resource`, { itemIndex });
        }

        return {
            json: result as unknown as IDataObject,
            pairedItem: itemIndex,
        };
    }
}
