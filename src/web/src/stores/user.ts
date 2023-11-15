import { setLoginToken, setUsername } from "../utils/auth";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { removeLoginToken } from "../utils/auth";
import store from "store";
import useUpdateStore from "./update";

type State = {
  user: Record<string, string>;
};

type Actions = {
  logout: () => Promise<any>;
  updateUsername: (username: string) => void;
  updateLoginToken: (loginToken: string) => void;
};

const initialState: State = {
  user: {
    account: store.get("username") || "",
    loginToken: store.get("loginToken") || "",
  },
};

const useUserStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    // 设置子账号
    updateUsername: (username: string) => {
      setUsername(username);
      set({
        user: {
          account: username,
        },
      });
    },
    updateLoginToken: (loginToken: string) => {
      set({
        user: {
          loginToken,
        },
      });
      // 保存登录token
      setLoginToken(loginToken);
    },
    // 用户注销登录
    logout: () => {
      useUpdateStore.getState().clearUpdateInfo();
      return new Promise((resolve) => {
        // 删除登录token
        removeLoginToken();
        clearData();
        set({
          user: {
            loginToken: "",
            account: "",
          },
        });
        resolve(true);
      });
    },
  }))
);

// 清除数据
function clearData() {
  store.remove("loginToken");
  store.remove("mqttConfig");
}

export default useUserStore;
