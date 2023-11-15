import { FC, useEffect, useMemo } from "react";
import UpdateModal from "../components/UpdateModal";
import Titlebar from "../components/common/Titlebar";
import { TITLEBAR_HEIGHT } from "../config";
import { createSelectors } from "../stores";
import useUpdateStore from "../stores/update";
import React from "react";
import "./layout.less";
import useSizeStore from "../stores/size";
import { getUpdateLog, removeUpdateLog } from "../utils/updateLog";
import { useLocation } from "react-router";
import ErrorBoundary from "../components/ErrorBoundary";
import { isEmptyObject } from "lib/common/type";


interface StateProps {
  children: React.ReactNode;
}

const BasicLayout: FC<StateProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const clearUpdateInfo = createSelectors(useUpdateStore).use.clearUpdateInfo();
  const updateInfo = createSelectors(useUpdateStore).use.updateInfo();
  const windowHeight = createSelectors(useSizeStore).use.windowHeight();

  // 获取已安装的更新信息
  const installedUpdateInfo = getUpdateLog();
  const [showUpdateLogModal, setShowUpdateLogModal] = React.useState(false);

  useEffect(() => {
    setShowUpdateLogModal(false);

    // 如果是登录页面
    if (isLoginPage) {
    }

    if (installedUpdateInfo && installedUpdateInfo.isUpdateLog) {
      setTimeout(() => {
        setShowUpdateLogModal(true);
      }, 1000);
    } else {
      setShowUpdateLogModal(false);
    }
  }, []);

  // 是否有更新
  const hasUpdate = useMemo(() => {
    return !!updateInfo;
  }, [updateInfo]);

  // 关闭更新弹窗
  const closeUpdateModal = () => {
    clearUpdateInfo();
  };

  const closeUpdateLogModal = () => {
    removeUpdateLog();
    setShowUpdateLogModal(false);
  };

  return (
    <ErrorBoundary>
      <div
        className="basicLayout"
        style={{
          height: windowHeight + "px",
        }}
      >
        <div
          className="layout-navbar"
          style={{
            height: TITLEBAR_HEIGHT + "px",
          }}
        >
          <Titlebar></Titlebar>
        </div>

        <div
          className="layout-with-sidebar"
          style={{
            top: TITLEBAR_HEIGHT + "px",
            height: windowHeight - TITLEBAR_HEIGHT + "px",
          }}
        >
          {children}
        </div>

        {hasUpdate && (
          <UpdateModal
            zIndex={2000}
            visible={hasUpdate}
            closable={!updateInfo?.must_update}
            updateInfo={updateInfo}
            onCancel={() => {
              closeUpdateModal();
            }}
          ></UpdateModal>
        )}

        <UpdateModal
          zIndex={500}
          visible={showUpdateLogModal && !isEmptyObject(installedUpdateInfo)}
          closable={true}
          updateInfo={installedUpdateInfo!}
          onCancel={() => {
            closeUpdateLogModal();
          }}
        ></UpdateModal>
      </div>
    </ErrorBoundary>
  );
};

export default BasicLayout;
