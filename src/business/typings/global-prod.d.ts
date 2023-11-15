declare global {
  interface Window {
    __hooks: any;

    interceptLoader: any;

    // 禁用发送翻译
    __DisableSendTT: boolean;

    // 禁用接收翻译
    __DisableReceiveTT: boolean;

    // 会话翻译设置
    sessionTranslationSetting: Record<string, any>;

    _instance: any;
  }
}

// fake export to make global work
export {};
