// api/user.ts
import type { BasicUserInfo } from '~/types'
import { useNuxtApp } from '#app'
import httpRequest from "~/utils/request";
interface UserParams {
  user_id?: string
}

interface OrderParams {
  days: number
  paytype: string
  method: string
}

interface InviteParams {
  page: number
  page_size: number
}
interface LoginParams {
        mobile: string;
        captcha: string;
    }
interface LoginResult {
        userinfo: BasicUserInfo;
    }
export interface Notice {
  id: number
  type: 'msg' | 'vip_charge' | 'vip_expirre'
  content: string
  name: string
  deletetime: number
  createtime: number
}

export function useUserApi() {
  const  $request  = httpRequest

  return {
    /**
 * 用户登录
 */
mobileLogin: (data?: LoginParams) =>
      $request.post<LoginResult>('/user/mobilelogin', data),
    /**
     * 获取用户信息
     */
    getUserInfo: (params?: UserParams) =>
      $request.get<BasicUserInfo>('/user/index', params),

    /**
     * 修改用户信息
     */
    saveUserInfo: (data: { data: string }) =>
      $request.post<string>('/user/save', data),

    /**
     * 获取会员选择列表
     */
    getUserList: () =>
      $request.get<BasicUserInfo[]>('/vip/getList'),

    /**
     * 获取会员出售流转列表
     */
    getFlowList: () =>
      $request.get<BasicUserInfo[]>('/vip/getFlow'),

    /**
     * 创建会员订单
     */
    createOrder: (data: OrderParams) =>
      $request.post<string>('/vip/createOrder', data),

    /**
     * 获取邀请记录列表
     */
    getInviteList: (params: InviteParams) =>
      $request.get<{ total: number; data: BasicUserInfo[] }>('/user/getInviteList', params),

    /**
     * 绑定邀请人
     */
    bindInvited: (data: { invited_id: string }) =>
      $request.post<null>('/user/invited', data),

    /**
     * 获取通知公告
     */
    getNoticeList: (params: InviteParams) =>
      $request.get<{ total: number; data: Notice[] }>('/notice/list', params),
  }
}
