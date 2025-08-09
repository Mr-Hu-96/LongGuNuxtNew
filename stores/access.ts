
import { acceptHMRUpdate, defineStore } from 'pinia';

type AccessToken = string;

interface AccessState {


    /**
     * 登录 accessToken
     */
    accessToken: AccessToken;

    /**
     * 登录是否过期
     */
    loginExpired: boolean;

}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('core-access', {
    actions: {


        setAccessToken(token: AccessToken) {
            this.accessToken = token;
        },
        getAccessToken() {
            return this.accessToken;
        },

        setLoginExpired(loginExpired: boolean) {
            this.loginExpired = loginExpired;
        },

    },
    persist: {
        // 持久化
        pick: ['accessToken'],
    },
    state: (): AccessState => ({
        accessToken: '',
        loginExpired: false,

    }),
});
