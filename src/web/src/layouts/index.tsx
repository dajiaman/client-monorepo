import "../styles/index.less";
import { useEffect, useState } from "react";
import { ACTIVITYBAR_WIDTH } from "../config";
import ActivityBar from "../components/common/ActivityBar";
import BasicLayout from "./basic";
import Initialization from "../components/Initialization";
import { Outlet } from "react-router";
import useSessionStore from "../stores/session";
import { createSelectors } from "../stores";
import useAppStore from "../stores/app";

// 登录后的布局
const DefaultLayout = () => {
  const [loading, setLoading] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  // 重置会话
  const resetAllSesssion =
    createSelectors(useSessionStore).use.resetAllSesssion();

  // hydrate完成事件
  useAppStore.persist.onFinishHydration((state) => {
    if (useSessionStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
  });
  useSessionStore.persist.onFinishHydration((state) => {
    resetAllSesssion();
    if (useAppStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
  });

  useEffect(() => {
    return () => {};
  }, []);

  // 先进行初始化
  if (loading && hasHydrated) {
    return (
      <Initialization
        complete={() => {
          setLoading(false);
        }}
      ></Initialization>
    );
  }

  return (
    <BasicLayout>
      <div className="layout-inner">
        <div
          className="activityBar-wrapper"
          style={{
            left: "0px",
            width: `${ACTIVITYBAR_WIDTH}px`,
          }}
        >
          <ActivityBar></ActivityBar>
        </div>
        <div
          className="main-content-wrapper"
          style={{
            left: `${ACTIVITYBAR_WIDTH}px`,
          }}
        >
          <Outlet />
        </div>
      </div>
    </BasicLayout>
  );
};

export default DefaultLayout;
