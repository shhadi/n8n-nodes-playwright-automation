import { NodeOperationError, type IDataObject, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';

import { runScript } from '../actions/script';
import { PlaywrightManager } from '../PlaywrightManager';
import { ScriptOperation, type ActionResult } from '../types';

import { type IController } from './IController';

export class ScriptController implements IController {
    async execute(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData> {
        const operation = executeFunctions.getNodeParameter('operation', itemIndex) as ScriptOperation;
        const manager = PlaywrightManager.getInstance();

        const sessionId = executeFunctions.getNodeParameter('sessionId', itemIndex) as string;
        const session = manager.getSession(sessionId);

        if (!session) {
            throw new NodeOperationError(executeFunctions.getNode(), `Session ${sessionId} not found`, { itemIndex });
        }

        const page = session.page;
        const context = session.context;

        let result: ActionResult | undefined;

        switch (operation) {
            case ScriptOperation.Run: {
                const scriptCode = executeFunctions.getNodeParameter('scriptCode', itemIndex) as string;
                result = await runScript(page, context, scriptCode);
                break;
            }
            default:
                throw new NodeOperationError(executeFunctions.getNode(), `Operation ${operation} not supported for Script resource`, { itemIndex });
        }

        return {
            json: result as unknown as IDataObject,
            pairedItem: itemIndex,
        };
    }
}
