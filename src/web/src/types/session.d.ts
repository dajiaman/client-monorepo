import { AppNameEnum } from "../config/app.config";

export interface SessionAppParam {
    // 全局唯一标识
    sessionId: string;
    // 应用名称
    appName: AppNameEnum;

    // 登录时生成的子会话id
    user_info_child_channel_id: number | null;
    user_info_channel_id: number | null;

    // 上次打开的tab 名称
    tab: string;

    // 创建时间
    createTime: number;
    // 最后一次编辑时间
    editTime: number | null;
    // 最后启动时间
    startUpTime: number | null;

    // 备注
    remark: string;
    // 是否已启动了
    active: boolean;

    // view 是否已经加载
    isLoaded: boolean;
    // view 增在加载中
    isLoadingView: boolean;

    // 是否分离窗口
    isSplit: boolean;
    // 右侧面板是否收起
    isCollapsed: boolean;

    // 翻译
    TSLS: string;
    // 会话代理
    SPS: string;

    // 应用中的用户信息
    userInfo: {
        username: string;
        nickname: string;
        headImg: string;
        phoneNumber: string;
        unreadCount: number;
        userid: string;
        online: boolean;
    };
}
