
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

}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = defineStore('core-access', {
    actions: {


        setAccessToken(token: AccessToken) {
            this.accessToken = token;
            // 客户端写 cookie
            if (process.client) {
                document.cookie = `token=${token}; path=/; max-age=604800` // 7天
            }

            // SSR 写 cookie
            if (process.server) {
                const nuxtApp = useNuxtApp()
                if (nuxtApp.ssrContext?.event?.res) {
                    nuxtApp.ssrContext.event.res.setHeader(
                        'Set-Cookie',
                        `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
                    )
                }
            }
        },

        setLoginExpired(loginExpired: boolean) {
            this.loginExpired = loginExpired;
        },

        getAccessToken() {
            if (process.client) {
                return this.accessToken || localStorage.getItem('accessToken') || ''
            }
            if (process.server) {
                const nuxtApp = useNuxtApp()
                const cookie = nuxtApp.ssrContext?.event?.req.headers.cookie
                if (!cookie) return ''
                const match = cookie.match(/token=([^;]+)/)
                return match ? match[1] : ''
            }
            return ''

        },

    },
    persist: {
        // 持久化
        pick: ['accessToken'],
    },
    state: (): AccessState => ({
        accessToken: null,
        loginExpired: false,

    }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
    hot.accept(acceptHMRUpdate(useAccessStore, hot));
}
