import { useNuxtApp } from '#app'
import httpRequest from "~/utils/request";
export function useStockApi() {
  const  $request  = httpRequest

  return {
    /**
     * 股票查询列表
     */
    getStockList: (params: StockParams) =>
      $request.get<StockModel>('/stock/list', params),

    /**
     * 添加自选
     */
    addFavorite: (data: { code: string }) =>
      $request.post<any>('/stock/addFavorite', data),

    /**
     * 股票自选列表
     */
    getFavorites: () =>
      $request.get<StockModel>('/stock/favorites'),

    /**
     * 删除自选
     */
    deleteFavorites: (data: { code: string }) =>
      $request.post<StockModel>('/stock/removeFavorite', data),

    /**
     * 修改备注
     */
    updateFavorite: (data: { mark: string; code: number }) =>
      $request.post<any>('/stock/markFavorite', data),

    /**
     * 查询股票基本信息
     */
    getByCode: (params: { code: string }) =>
      $request.get<StockInfoParams>('/stock/getByCode', params),

    /**
     * 股票详情-个股快讯
     */
    getNewsList: (params: { code: string }) =>
      $request.get<StockInfoParams>('/stock/getNewsList', params),

    /**
     * 股票详情-历史涨停
     */
    histroyLimitUp: (params: { code: string }) =>
      $request.get<StockInfoParams>('/stock/histroyLimitUp', params),

    /**
     * 获取龙板通达
     */
    getLbtd: (data: { date: string }) =>
      $request.post<any>('/index/getLbtd', data),

    /**
     * 获取热点
     */
    getHot: (data: { date: string }) =>
      $request.post<any>('/index/getHot', data)
  }
}

export interface StockModelList {
  stock_id: string;
  code: string;
  name: string;
  increase: string;
  circulation_value: string;
  total_value: string;
}

interface StockModel {
  list: StockModelList[]
  total: number
}

interface StockParams {
  keyowrd?: string
  page?: number
  page_size?: number
}

interface Page {
  page: number
  page_size: number
}

export interface StockInfoParams {
  code: string
  stock_id: string
  name: string
  increase: string
  price: string
  prev_close: string
  open_price: string
  high_price: string
  low_price: string
  volume: string
  amount: number
  circulation_value: string
  total_value: string
  turnover_ratio: string
  company_info: string
  kpl_logic: string
  xgb_logic: string
  cls_logic: string
}
