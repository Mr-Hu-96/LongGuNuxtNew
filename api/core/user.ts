import { requestClient } from '@/api/request';
import type { BasicUserInfo } from '@/types';

/**
 * 获取用户信息
 */
interface UserParams {
  user_id?: string;
}
export function getUserInfoApi(params?:UserParams) {
  return requestClient.get<BasicUserInfo>('/user/index',{ params })
}

/**
 *  修改用户信息
 */
export function saveUserInfoApi(data: { data: string }) {
  return requestClient.post<string>('/user/save', data)
}

/**
 * 获取会员选择列表
 */
export function getUserListApi() {
  return requestClient.get<BasicUserInfo[]>('/vip/getList')
}

/**
 * 获取会员出售列表
 */
export function getFlowApi() {
  return requestClient.get<BasicUserInfo[]>('/vip/getFlow')
}


interface OrderParams {
  days: number;
  paytype: string;
  method: string;
}
/**
 *  创建会员订单
 */
export function createOrder(data: OrderParams) {
  return requestClient.post<string>('/vip/createOrder', data)
}


/**
 * 获取邀请列表
 */
interface InviteParams {
  page: number;
  page_size: number;
}
export function getInviteList(params: InviteParams) {
  return requestClient.get<{ total: number; data: BasicUserInfo[] }>('/user/getInviteList', { params })
}


/**
 * 绑定邀请人
 */
export function bindInvited(data: { invited_id: string }) {
  return requestClient.post<any>('/user/invited', data)
}


export interface Notice {
  type: 'msg' | 'vip_charge' | 'vip_expirre';
  id: number
  content: string;
  name: string;
  deletetime: number
  createtime: number

}

export function getNoticeListApi(params: InviteParams) {
  return requestClient.get<{ total: number; data: Notice[] }>('/notice/list', { params })
}