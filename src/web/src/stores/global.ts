import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
  translateTypes: ITranslateTypes;
};

interface ITranslateTypes {
  defaultType?: number;
  apiTypeList: number[];
}

type Actions = {
  setTranslateTypes: (translateTypes: ITranslateTypes) => void;
};

// 全局的 store
const useGlobalStore = create<State & Actions>()(
  devtools((set) => ({
    // 翻译类型
    translateTypes: {
      // 默认翻译类型
      defaultType: undefined,
      // 支持的翻译类型
      apiTypeList: [],
    },
    // 设置翻译类型
    setTranslateTypes: (translateTypes: ITranslateTypes) => {
      set({
        translateTypes: translateTypes,
      });
    },
  }))
);

export default useGlobalStore;
