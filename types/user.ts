
export interface BasicUserInfo {
    /**
     * 头像
     */
    avatar: string;
    /**
     * 用户昵称
     */
    nickname: string;

    /**
     * 用户id
     */
    id?: string;
    /**
     * 描述
     */
    brief: string;
    email: string
    mobile: string
    qq: string
    wechat: string
    registertime: number
    [key: string]: any;
}
