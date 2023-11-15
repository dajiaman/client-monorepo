import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type State = {
  showOrHideShortCut: string;
};

type Actions = {
  setShowOrHideShortCut: (shortcut: string) => void;
};

// 设置 store
const useShortCutStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        // 显示隐藏键位
        showOrHideShortCut: "",
        // 设置显示隐藏键位
        setShowOrHideShortCut: (shortcut: string) => {
          set({
            showOrHideShortCut: shortcut,
          });
        },
        // 清除显示隐藏键位
        clearShowOrHideShortCut: () => {
          set({
            showOrHideShortCut: "",
          });
        },
      }),
      {
        name: "shortcut-storage",
        version: 1,
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useShortCutStore;
