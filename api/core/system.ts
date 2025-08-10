import { useNuxtApp } from '#app'

export function useSystemApi() {
  const { $request } = useNuxtApp()

  return {
    /**
     * 上传文件
     */
    uploadFile: (data: { file: File }) =>
      $request.post<{ url: string; fullurl: string }>('/upload/index', data),

    /**
     * 监管中心
     */
    getRegulatoryList: (params: SystemRegulatory) =>
      $request.get<RegulatoryModel>('/regulatory_center/consolidated', { params }),

    /**
     * 获取TDK
     */
    getTdk: (params: { module_type: '首页' | '资讯' | '详情' }) =>
      $request.get<any>('/seo/getTdk', { params })
  }
}

interface SystemRegulatory {
  keyword?: string
  start_date?: string
  end_date?: string
  types?: number[]
  page?: number
  page_size?: number
}

interface Page {
  page: number
  page_size: number
}

interface IStockAlert {
  id: string | number;
  code: string;
  name: string;
  px_change_rate: number;
  alert_date: string;
  is_handled: 0 | 1;
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
