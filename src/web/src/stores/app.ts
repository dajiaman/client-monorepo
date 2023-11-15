import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import indexdbStorage from "./indexdbStorage";
import { AppNameEnum } from "../config/app.config";

export interface IAvailableApp {
    id: string;
    name: AppNameEnum;
    // 打开url
    url: string;
    // 是否可用
    available: boolean;
    // 是否选中
    checked: boolean;
    // 是否有运行中的子应用
    hasChildren: boolean;
    user_info_channel_id: number | null;
    // 自定义
    customize: boolean | undefined;
    // 测速度url
    speedTestUrl: string;
}

type State = {
    availableApps: IAvailableApp[];
};

type Actions = {
    setAvailableApps: (availableApps: IAvailableApp[]) => void;
};

const useAppStore = create<State & Actions>()(
    devtools(
        persist(
            (set) => ({
                // 可用的应用
                availableApps: [],
                // 设置可用的应用
                setAvailableApps: (availableApps: IAvailableApp[]) => {
                    set({
                        availableApps,
                    });
                },
            }),
            {
                name: "app-storage",
                version: 1,
                storage: indexdbStorage,
                skipHydration: false,
            }
        )
    )
);

export default useAppStore;
