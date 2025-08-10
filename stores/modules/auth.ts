import type { Recordable, BasicUserInfo } from '@/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH } from '@/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getUserInfoApi, mobileLogin, logoutApi } from '@/api';


export const useAuthStore = defineStore('auth', () => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();
    const router = useRouter();

    const loginLoading = ref(false);

    /**
     * 异步处理登录操作
     * Asynchronously handle the login process
     * @param params 登录表单数据
     */
    async function authLogin(
        params: Recordable<any>,
        onSuccess?: () => Promise<void> | void,
    ) {
        // 异步处理用户登录操作并获取 accessToken
        let userInfo: null | BasicUserInfo = null;
        try {
            loginLoading.value = true;
            const { accessToken } = await mobileLogin(params);

            // 如果成功获取到 accessToken
            if (accessToken) {
                accessStore.setAccessToken(accessToken);

                // 获取用户信息并存储到 accessStore 中
                const [fetchUserInfoResult] = await Promise.all([
                    fetchUserInfo(),
                ]);

                userInfo = fetchUserInfoResult;

                userStore.setUserInfo(userInfo);


                if (accessStore.loginExpired) {
                    accessStore.setLoginExpired(false);
                } else {
                    onSuccess
                        ? await onSuccess?.()
                        : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
                }

                if (userInfo?.realName) {
                    notification.success({
                        description: `登录人:${userInfo?.realName}`,
                        duration: 3,
                        message: '登录成功',
                    });
                }
            }
        } finally {
            loginLoading.value = false;
        }

        return {
            userInfo,
        };
    }

    async function logout(redirect: boolean = true) {
        try {
            await logoutApi();
        } catch {
            // 不做任何处理
        }
        resetAllStores();

        // 回登录页带上当前路由地址
        await router.replace({
            path: '/',
            query: redirect
                ? {
                    redirect: encodeURIComponent(router.currentRoute.value.fullPath),
                }
                : {},
        });
    }

    async function fetchUserInfo() {
        let userInfo: null | BasicUserInfo = null;
        userInfo = await getUserInfoApi();
        userStore.setUserInfo(userInfo);
        return userInfo;
    }

    function $reset() {
        loginLoading.value = false;
    }

    return {
        $reset,
        authLogin,
        fetchUserInfo,
        loginLoading,
        logout,
    };
});
