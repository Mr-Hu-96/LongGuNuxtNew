import type { BasicUserInfo } from '~/types'
import { useNuxtApp } from '#app'

export namespace AuthApi {
    /** 登录接口参数 */
    export interface LoginParams {
        mobile: string;
        captcha: string;
    }

    /** 登录接口返回值 */
    export interface LoginResult {
        userinfo: BasicUserInfo;
    }
}

export function useAuthApi() {
  const { $request } = useNuxtApp()

  return {
    /**
     * 用户登录
     */
    mobileLogin: (data: AuthApi.LoginParams) =>
      $request.post<AuthApi.LoginResult>('/user/mobilelogin', data),

    /**
     * 退出登录
     */
    logout: () =>
      $request.post<AuthApi.LoginResult>('/user/logout'),

    /**
     * 发送验证码
     */
    smsSend: (data: { mobile: string; event: 'mobilelogin' }) =>
      $request.post('/sms/send', data),

    /**
     * 获取微信扫码ticket
     */
    getTicket: () =>
      $request.get<{ ticket: string; scene_id: number }>('/wechat/getTicket'),

    /**
     * 获取微信扫码状态
     */
    checkLogin: (scene_id: number) =>
      $request.get<{ status: number; is_bind_mobile: number; token: string }>('/wechat/checkLogin', { params: { scene_id } })
  }
}
