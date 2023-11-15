// 快捷回复分组
export interface IQuickReplyGroup {
    name: string;
    id: string;
    createTime: number;
    updateTime: number;
    checked: boolean;
    // 模板
    templateList?: IQuickReplyTemplate[];
}

// 回复模板
export interface IQuickReplyTemplate {
    id: string;
    // 模板名称
    name: string;
    // 创建时间
    createTime: number;
    // 最后编辑时间
    updateTime: number;
    // 选中
    checked: boolean;
    // 回复内容
    replyList?: IQuickReply[];
}

export interface IQuickReply {
    id: string;
    content: string;
    // 创建时间
    createTime: number;
    // 最后编辑时间
    updateTime: number;
    // 类型
    type: QuickReplyType;
}

// 快捷回复类型
// text: 文本
// image: 图片
// contactCard: 名片
export type QuickReplyType = "text" | "image" | "contactCard";
