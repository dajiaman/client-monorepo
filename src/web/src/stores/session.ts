import { SessionAppParam } from "../types/session";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import indexdbStorage from "./indexdbStorage";
import { buildSessionId } from "../utils/buildSessionId";
import { AppNameEnum } from "../config/app.config";
import useAppStore from "./app";
import { IS_ELECTRON_BUILD } from "../config";
import { IpcRenderer } from "../../typings/electronTypes";

interface SessionStoreState {
  sessionList: Record<string, SessionAppParam[]>;
  // 选中的会话id
  selectedSessionId: string;

  setSelectedSessionId: (sessionId: string) => void;

  addSession: (appName: string) => Promise<boolean>;
  resetAllSesssion: () => Promise<any>;
  removeSession: (appName: string, sessionId: string) => Promise<boolean>;
  startSession: (appName: string, sessionId: string) => Promise<any>;
  showSessionView: (appName: string, sessionId: string) => Promise<boolean>;
  closeSession: (appName: string, sessionId: string) => Promise<boolean>;
  updateSessionRemark: (
    appName: string,
    sessionId: string,
    remark: string
  ) => void;
}

const defaultTab = "translation";

// 会话
const useSessionStore = create<SessionStoreState>()(
  devtools(
    persist(
      (set) => ({
        // 会话列表
        sessionList: {},
        selectedSessionId: "",
        setSelectedSessionId: (sessionId: string) => {
          set(() => {
            return {
              selectedSessionId: sessionId,
            };
          });
        },

        // 添加新会话
        addSession: (appName: string) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const appPlatform = useAppStore
              .getState()
              .availableApps.find((app) => {
                return app.name === appName;
              });

            const session: SessionAppParam = {
              sessionId: buildSessionId(appName),
              appName: appName as AppNameEnum,
              // 登录后才会有
              user_info_child_channel_id: null,
              user_info_channel_id: appPlatform?.user_info_channel_id ?? null,
              tab: defaultTab,
              createTime: new Date().getTime(),
              editTime: null,
              startUpTime: null,
              remark: "",
              active: false,
              isLoaded: false,
              isLoadingView: false,
              isSplit: false,
              isCollapsed: false,
              TSLS: "",
              SPS: "",
              userInfo: {
                username: "",
                nickname: "",
                headImg: "",
                phoneNumber: "",
                unreadCount: 0,
                userid: "",
                online: false,
              },
            };
            sessionList.push(session);
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
          return Promise.resolve(true);
        },

        // 删除会话
        removeSession: async (appName: string, sessionId: string) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList.splice(index, 1);
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });

          return true;
        },

        // 启动会话
        startSession: async (appName: string, sessionId: string) => {
          if (IS_ELECTRON_BUILD) {
            try {
              await ((window as any)?.vscode?.ipcRenderer as IpcRenderer)?.invoke(
                "open-browser-view",
                {
                  sessionId: sessionId,
                }
              );
            } catch (error: any) {
              console.log("startSession error: ", typeof error);
              throw error;
            }
          }

          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              // 更新启动时间
              sessionList[index].startUpTime = new Date().getTime();
              sessionList[index].active = true;
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
          return true;
        },

        showSessionView: async (appName: string, sessionId: string) => {
          await ((window as any)?.vscode?.ipcRenderer as IpcRenderer)?.invoke(
            "show-browser-view",
            {
              sessionId: sessionId,
            }
          );
          return true;
        },

        // 关闭所有会话
        resetAllSesssion: async (): Promise<boolean> => {
          if (IS_ELECTRON_BUILD) {
            await (window as any)?.vscode?.ipcRenderer?.invoke(
              "close-all-browser-view"
            );
          }

          set((state) => {
            for (const key in state.sessionList) {
              state.sessionList[key].map((item) => {
                item.active = false;
                item.isLoaded = false;
                item.isLoadingView = false;
                item.isSplit = false;
                item.isCollapsed = false;
                item.userInfo.unreadCount = 0;
                item.userInfo.online = false;
                item.user_info_child_channel_id = null;
              });
            }
            return {
              sessionList: state.sessionList,
            };
          });

          return true;
        },

        // 关闭会话
        closeSession: async (appName: string, sessionId: string) => {
          if (IS_ELECTRON_BUILD) {
            await (window as any)?.vscode?.ipcRenderer?.invoke(
              "close-browser-view",
              {
                sessionId: sessionId,
              }
            );
          }

          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList[index].active = false;
              sessionList[index].isLoaded = false;
              sessionList[index].isLoadingView = false;
              sessionList[index].isSplit = false;
              sessionList[index].isCollapsed = false;
              sessionList[index].userInfo.unreadCount = 0;
              sessionList[index].userInfo.online = false;
              sessionList[index].user_info_child_channel_id = null;
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });

          return true;
        },

        // 更新会话备注
        updateSessionRemark: (
          appName: string,
          sessionId: string,
          remark: string
        ) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList[index].remark = remark;
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
        },

        // 更新未读数
        updateSessionUnreadCount: (
          appName: string,
          sessionId: string,
          unreadCount: number
        ) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList[index].userInfo.unreadCount = unreadCount;
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
        },

        // 更新最后选中的tab - 右侧面板
        updateSessionSelectTab: (
          appName: string,
          sessionId: string,
          selectedTab: string
        ) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList[index].tab = selectedTab;
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
        },

        /**
         * 更新翻译设置
         * @param appName
         * @param sessionId
         * @param translationSetting 翻译设置的json字符串
         */
        updateSessionTranslationSetting: (
          appName: string,
          sessionId: string,
          translationSetting: string
        ) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList[index].TSLS = translationSetting;
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
        },

        /**
         * 更新代理设置
         * @param appName
         * @param sessionId
         * @param proxySetting 代理设置的json字符串
         */
        updateSessionProxySetting: (
          appName: string,
          sessionId: string,
          proxySetting: string
        ) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList[index].SPS = proxySetting;
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
        },

        /**
         * 重置会话用户信息
         * @param appName
         * @param sessionId
         */
        resetSessionUserInfo: (appName: string, sessionId: string) => {
          set((state) => {
            const sessionList = state.sessionList[appName] || [];
            const index = sessionList.findIndex(
              (item) => item.sessionId === sessionId
            );
            if (index > -1) {
              sessionList[index].userInfo.unreadCount = 0;
              sessionList[index].userInfo.online = false;
              sessionList[index].userInfo.headImg = "";
              sessionList[index].userInfo.nickname = "";
              sessionList[index].userInfo.userid = "";
              sessionList[index].userInfo.username = "";
              sessionList[index].userInfo.phoneNumber = "";
            }
            return {
              sessionList: {
                ...state.sessionList,
                [appName]: sessionList,
              },
            };
          });
        },
      }),
      {
        name: "sessionList-storage",
        version: 1,
        storage: indexdbStorage,
      }
    )
  )
);

export default useSessionStore;
