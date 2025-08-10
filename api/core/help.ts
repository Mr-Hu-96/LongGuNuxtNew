import { requestClient } from '~/api/request';

export interface HelpModelList {
    id:  number;
    title: string;
    content: string;
    create_time: string;
} 
 interface HelpModel {
    list: HelpModelList[]
    total: number
}
/**
 *  监管中心
 */
export function getHelpListApi() {
    return requestClient.get<HelpModel>('/help/list')
}

