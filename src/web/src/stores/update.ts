import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { CommonService } from "../api/common";
import { getClientVersion } from "../utils/version";
import { IUpdateInfo } from "../components/UpdateModal";

type State = {
  updateInfo: IUpdateInfo | null;
  hasUpdate: boolean;
  lastCheckTime: number;
  version: string;
  remoteVersion: string;
};

type Actions = {
  setUpdateInfo: (updateInfo: IUpdateInfo | null) => void;
  // 请空更新信息
  clearUpdateInfo: () => void;
  checkUpdate: () => Promise<any>;
};

const initialState: State = {
  updateInfo: null,
  hasUpdate: false,
  lastCheckTime: 0,
  version: getClientVersion(),
  remoteVersion: "",
};

const useUpdateStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // 设置更新信息
        setUpdateInfo: (updateInfo: IUpdateInfo | null) => {
          // 检查一下更新版本是否一致
          set({
            updateInfo: updateInfo,
          });
        },

        // 清除更新信息，置为空
        clearUpdateInfo: () => {
          set({
            updateInfo: null,
          });
        },

        // 检查更新
        checkUpdate: () => {
          return new Promise((resolve, reject) => {
            // 更新上次检查时间
            set({
              lastCheckTime: Date.now(),
            });
            return CommonService.checkUpdateApi()
              .then((res) => {
                if (!res?.data) {
                  return reject({
                    code: -1,
                    message: "already-latest-version",
                  });
                }

                const remoteVersion = res.data.version;
                const appVersion = getClientVersion();

                // 服务端版本小于等于客户端版本，不继续处理
                // if (!semver.gt(remoteVersion, appVersion)) {
                // set({
                //   updateInfo: null,
                //   hasUpdate: false,
                // remoteVersion: "",
                // })
                //     // 已经是最新版本
                //     return reject({
                //         code: -1,
                //         message: "already-latest-version",
                //     });
                // }

                // 更新数据
                set({
                  updateInfo: res.data,
                  hasUpdate: true,
                  remoteVersion: remoteVersion,
                  lastCheckTime: Date.now(),
                });

                return resolve(res.data);
              })
              .catch((err) => {
                console.error("err", err);
                reject(err);
              });
          });
        },
      }),
      {
        name: "update-storage",
        version: 1,
        partialize: (state) => {
          return Object.fromEntries(
            Object.entries(state).filter(
              ([key]) =>
                !["updateInfo", "hasUpdate", "remoteVersion"].includes(key)
            )
          );
        },
      }
    )
  )
);

export default useUpdateStore;
