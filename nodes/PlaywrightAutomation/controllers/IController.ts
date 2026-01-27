import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export interface IController {
    execute(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<INodeExecutionData>;
}
