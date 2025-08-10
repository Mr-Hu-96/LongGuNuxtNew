import { requestClient } from '@/api/request';

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


/**
 *  股票查询列表
 */

interface StockParams extends Page {
    keyowrd?: string
}
export function getStockListApi(params: StockParams) {
    return requestClient.get<StockModel>('/stock/list', { params })
}

/**
 *  添加自选
 */

interface FavoriteParams {
    code: string
}
export function addFavorite(data: FavoriteParams) {
    return requestClient.post<any>('/stock/addFavorite', data)
}

/**
 *  股票自选列表
 */


export function getFavoritesApi() {
    return requestClient.get<StockModel>('/stock/favorites')
}

/**
 *  删除自选
 */


export function deleteFavoritesApi(data: { code: string }) {
    return requestClient.post<StockModel>('/stock/removeFavorite', data)
}


/**
 *  修改备注
 */

interface updateFavoriteParams {
    mark: string
    code: number
}
export function updateFavoriteApi(data: updateFavoriteParams) {
    return requestClient.post<any>('/stock/markFavorite', data)
}


/**
 *  查询股票基本信息
 */
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

export function getByCode(params: FavoriteParams) {
    return requestClient.get<StockInfoParams>('/stock/getByCode', { params })
}



/**
 *  股票详情-个股快讯
 */
export function getNewsListApi(params: FavoriteParams) {
    return requestClient.get<StockInfoParams>('/stock/getNewsList', { params })
}


/**
 *  股票详情-历史涨停
 */
export function histroyLimitUpApi(params: FavoriteParams) {
    return requestClient.get<StockInfoParams>('/stock/histroyLimitUp', { params })
}


export function getLbtd(data: { date: string }) {
    return requestClient.post<any>('/index/getLbtd', data)
}

export function getHot(data: { date: string }) {
    return requestClient.post<any>('/index/getHot', data)
}
