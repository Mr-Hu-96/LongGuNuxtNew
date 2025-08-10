import { requestClient } from '@/api/request';

/**
 *  上传文件
 */
export function uploadFile(data: { file: File }) {
    return requestClient.post<{ url: string; fullurl: string }>('/upload/index', data)
}


interface SystemRegulatory extends Page {
    keyword?: string
    start_date?: string
    end_date?: string
    types?: number[]
}
interface IStockAlert {
    id: string | number;
    code: string;
    name: string;
    px_change_rate: number;
    alert_date: string; // Could use Date type if you'll parse it
    is_handled: 0 | 1; // Can be number or boolean depending on your needs
    days_deviation: number;
    deviation_value: number;
    alert_description: string;
}
export interface RegulatoryModel {
    daily_alerts: IStockAlert[];
    next_day_alerts: IStockAlert[];
    key_monitoring: IStockAlert[];
    multiple_alerts: IStockAlert[];
    common_info: {
        date_range: {
            start: string,
            end: string
        }
    }
}
/**
 *  监管中心
 */
export function getRegulatoryList(params: SystemRegulatory) {
    return requestClient.get<RegulatoryModel>('/regulatory_center/consolidated', { params })
}

/**
 * 获取TDK
 */
interface TdkParams {
    module_type: '首页' | '资讯' | '详情';
}
export function getTdkApi(params: TdkParams) {
    return requestClient.get<any>('/seo/getTdk', { params })
}