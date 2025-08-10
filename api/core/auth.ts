import { requestClient } from '@/api/request';
import type { BasicUserInfo } from '@/types';
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



/**
 * 用户登录
 */
export function mobileLogin(data: AuthApi.LoginParams) {
    return requestClient.post<AuthApi.LoginResult>('/user/mobilelogin', data)
}


/**
 * 推出登录
 */
export function logoutApi() {
    return requestClient.post<AuthApi.LoginResult>('/user/logout')
}


/**
 * 发送验证码
 */
export function smsSend(data: { mobile: string; event: 'mobilelogin' }) {
    return requestClient.post('/sms/send', data)
}


/**
 * 获取微信扫码xin's ticket
 */
export function getTicket() {
    return requestClient.get<{ ticket: string; scene_id: number }>('/wechat/getTicket')
}

/**
 * 获取微信扫码状态
 */
export function checkLogin(scene_id: number) {
    return requestClient.get<{ status: number; is_bind_mobile: number; token: string }>('/wechat/checkLogin', { params: { scene_id } })
}