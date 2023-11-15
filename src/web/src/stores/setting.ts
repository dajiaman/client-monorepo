import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type State = {
  language: string;
  theme: "light" | "dark";
  isFollowSystemTheme: boolean;
  version: string;
};

type Actions = {
  setLanguage: (language: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setIsFollowSystemTheme: (isFollowSystemTheme: boolean) => void;
  setVersion: (version: string) => void;
};

// 设置 store
const useSettingStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        // 显示语言
        language: "zh-CN",
        // 主题
        theme: "light",
        // 是否跟随系统主题
        isFollowSystemTheme: false,
        // 当前版本
        version: "",

        // 设置语言
        setLanguage: (language: string) => {
          set({
            language: language,
          });
        },

        // 设置主题
        setTheme: (theme: "light" | "dark") => {
          set({
            theme: theme,
          });
        },

        // 设置是否跟随系统主题
        setIsFollowSystemTheme: (isFollowSystemTheme: boolean) => {
          set({
            isFollowSystemTheme: isFollowSystemTheme,
          });
        },

        // 设置版本号
        setVersion: (version: string) => {
          set({
            version: version,
          });
        },
      }),
      {
        name: "setting-storage",
        version: 1,
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useSettingStore;
