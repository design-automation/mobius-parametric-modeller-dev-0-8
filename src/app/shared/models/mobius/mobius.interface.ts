import { IFlowchart } from '@models/flowchart';

export interface IMobius {
    __filetype__: 'mobius';
    name: string;
    author: string;
    flowchart: IFlowchart;
    version: string;
    settings: any;
}
