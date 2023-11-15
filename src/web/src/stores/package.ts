import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CommonService } from "../api/common";

type State = {
  packageInfo: Record<string, any> | null;
  permissions: string[];
  broadcastLimit: number;
  // 免费套餐
  isFreePackage: boolean;
  // 标准套餐
  isStandardPackage: boolean;
  // 专业套餐
  isProfessionalPackage: boolean;
};

type Actions = {
  setPackageInfo: (packageInfo: Record<string, any>) => void;
  getPackageInfo: () => Promise<any>;
};

// 全局的 store
const useGlobalStore = create<State & Actions>()(
  devtools((set) => ({
    // 套餐信息
    packageInfo: null,
    permissions: [],
    broadcastLimit: -1,
    isFreePackage: false,
    isStandardPackage: false,
    isProfessionalPackage: false,

    // 设置套餐信息
    setPackageInfo: (packageInfo: Record<string, any>) => {
      set({
        packageInfo,
      });
    },

    // 获取套餐信息
    getPackageInfo: () => {
      return new Promise((resolve, reject) => {
        return CommonService.getPackageInfo()
          .then((res) => {
            const packageInfo = res?.data;
            // 对数据进行一些处理

            set({
              packageInfo,
            });
            resolve(packageInfo);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  }))
);

export default useGlobalStore;
