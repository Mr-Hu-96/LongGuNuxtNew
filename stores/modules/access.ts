
import { acceptHMRUpdate, defineStore } from 'pinia';

type AccessToken = null | string;

interface AccessState {


    /**
     * 登录 accessToken
     */
    accessToken: AccessToken;

    /**
     * 登录是否过期
     */
    loginExpired: boolean;
    /**
     * 登录 accessToken
     */
    refreshToken: AccessToken;
}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('core-access', {
    actions: {


        setAccessToken(token: AccessToken) {
            this.accessToken = token;
        },

        setLoginExpired(loginExpired: boolean) {
            this.loginExpired = loginExpired;
        },
        setRefreshToken(token: AccessToken) {
            this.refreshToken = token;
        },
    },
    persist: {
        // 持久化
        pick: ['accessToken', 'refreshToken'],
    },
    state: (): AccessState => ({
        accessToken: null,
        loginExpired: false,
        refreshToken: null,
    }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
    hot.accept(acceptHMRUpdate(useAccessStore, hot));
}
