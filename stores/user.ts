import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BasicUserInfo } from '@/types/user';

interface AccessState {
    /**
     * 用户信息
     */
    userInfo: BasicUserInfo | null;
    inviteCode: string | null;
}

export const useUserStore = defineStore('core-user', {
  actions: {
        setUserInfo(userInfo: BasicUserInfo | null) {
            // 设置用户信息
            this.userInfo = userInfo;
        },
        setInviteCode(inviteCode: string | null) {
            this.inviteCode = inviteCode
        },


    },
    state: (): AccessState => ({
        userInfo: null,
        inviteCode: null
    }),
    persist: {
        // 持久化
        pick: ['inviteCode'],
    },
})
