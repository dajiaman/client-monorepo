import { Button, Modal, Progress } from "@arco-design/web-react";
import { FC, useEffect, useMemo, useState } from "react";
import { useBoolean, useLocalStorageState } from "ahooks";
import { getUrlFromEnvConfig } from "../../utils/env";
import { saveUpdateLog } from "../../utils/updateLog";
import "./index.less";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import PerfectScrollBar from "react-perfect-scrollbar";

export interface IUpdateInfo {
  // 版本号
  version: string;
  // 更新内容
  message: string;
  // 是否强制更新
  must_update: boolean;
  position_type: string;
  system_type: string;
  isUpdateLog?: boolean;
  [prop: string]: any;
}

interface StateProps {
  visible: boolean;
  closable: boolean;
  updateInfo: null | IUpdateInfo;
  onCancel: () => void;
  zIndex?: number;
}

// 更新弹窗
const UpdateModal: FC<StateProps> = ({
  visible,
  closable,
  updateInfo,
  onCancel,
  zIndex,
}) => {
  const { t } = useTranslation();

  // 下载页面
  const websiteUrl = getUrlFromEnvConfig("downloadUrl");

  // 是否显示下载进度
  const [showDownloadProgress, setShowDownloadProgress] =
    useState<boolean>(false);

  useEffect(() => {
    if (showDownloadProgress) {
      setDownloadingTrue();
    }
  }, [showDownloadProgress]);

  const [lang, setLang] = useLocalStorageState<string | undefined>("lang", {
    defaultValue: "zh-CN",
  });

  // 自动下载
  const autoDownload = useMemo(() => {
    if (updateInfo?.isUpdateLog) {
      return false;
    }

    return !!updateInfo?.must_update;
  }, [updateInfo]);

  // 自动安装
  const autoInstall = useMemo(() => {
    if (updateInfo?.isUpdateLog) {
      return false;
    }
    return !!updateInfo?.must_update;
  }, [updateInfo]);

  // 更新日志
  const changelog = useMemo(() => {
    if (!updateInfo) {
      return "";
    }

    if (updateInfo && lang) {
      switch (lang) {
        case "zh-CN":
          return updateInfo.message;
        case "en-US":
          return updateInfo.message_en;
        case "zh-TW":
          return updateInfo.message_tw;
        default:
          return updateInfo.message;
      }
    }
  }, [updateInfo, lang]);

  // 检查中
  const [checking, { setTrue: setCheckingTrue, setFalse: setCheckingFalse }] =
    useBoolean(false);

  // 下载中
  const [
    downloading,
    { setTrue: setDownloadingTrue, setFalse: setDownloadingFalse },
  ] = useBoolean(false);

  // 下载进度
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // 下载完成
  const [
    downloaded,
    { setTrue: setDownloadedTrue, setFalse: setDownloadedFalse },
  ] = useBoolean(false);

  // 安装中
  const [
    installing,
    { setTrue: setInstallingTrue, setFalse: setInstallingFalse },
  ] = useBoolean(false);

  useEffect(() => {
    if (visible && updateInfo && updateInfo?.isUpdateLog) {
      setShowDownloadProgress(false);
    }

    return () => {
      setCheckingFalse();
      setDownloadingFalse();
      setDownloadedFalse();
      setInstallingFalse();
      setDownloadProgress(0);
    };
  }, [visible]);

  // 模拟下载进度
  const mockProgress = () => {
    // const timer = setInterval(() => {
    //   if (downloadProgress >= 100) {
    //     clearInterval(timer);
    //   } else {
    //     setDownloadProgress((downloadProgress) => {
    //       return downloadProgress + 2;
    //     });
    //   }
    // }, 300);

    setTimeout(() => {
      setDownloadProgress(100);
    }, 200);
  };

  useEffect(() => {
    if (downloadProgress >= 100) {
      setDownloadedTrue();
      setDownloadProgress(100);
      setShowDownloadProgress(false);
      setDownloadingFalse();

      // 自动开始安装
      if (autoInstall) {
        installApp();
      }
    }
  }, [downloadProgress]);

  // 安装app
  const installApp = () => {
    console.log("installing app...");
    setShowDownloadProgress(false);
    setInstallingTrue();

    // 记录更新日志到本地，后续展示版本更新日志
    saveUpdateLog({
      ...updateInfo!,
      isUpdateLog: true,
    });
  };

  const renderButtons = () => {
    if (updateInfo && updateInfo?.isUpdateLog) {
      return (
        <>
          <Button
            type="primary"
            size="large"
            className={classNames("btn", "confirm-btn")}
            onClick={() => {
              onCancel();
            }}
          >
            {t("got-it")}
          </Button>
        </>
      );
    }

    if (autoDownload) {
      return <></>;
    }

    // 还未更新
    if (!checking && !downloading && !downloaded && !installing) {
      return (
        <>
          <Button
            type="primary"
            size="large"
            className={classNames("btn", "update-btn")}
            onClick={() => {
              setShowDownloadProgress(true);
              mockProgress();
            }}
          >
            {t("immediately-update")}
          </Button>
        </>
      );
    }

    // 自动安装中
    if (autoInstall && downloaded) {
    }

    if (!autoInstall && downloaded) {
      return (
        <>
          <Button
            type="primary"
            size="large"
            className={classNames("btn", "install-btn")}
            onClick={(e) => {
              installApp();
            }}
          >
            {t("install")}
          </Button>
        </>
      );
    }

    return <></>;
  };

  // 渲染下载进度
  const renderDownloadProgress = () => {
    if (installing) {
      return null;
    }

    return (
      <>
        <Progress
          type="line"
          size="large"
          percent={downloadProgress}
          showText={false}
          className="update-model-progress"
        ></Progress>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      className="update-modal"
      maskClosable={false}
      escToExit={false}
      footer={null}
      style={{
        width: "480px",
        zIndex: zIndex,
      }}
      closable={closable}
      onCancel={onCancel}
      focusLock={true}
    >
      <div className="update-modal-inner" data-version={updateInfo?.version}>
        <div className="update-modal-header">
          <div className="update-modal-title">
            <span className="version">{updateInfo?.version}</span>
            <span>
              {!updateInfo?.isUpdateLog
                ? t("version-update")
                : t("update-content")}
            </span>
          </div>
          <div className="subtitle">
            <span className="label">{t("publish-time")}：</span>
            {updateInfo?.create_time}
          </div>
        </div>

        <div
          className="update-modal-content"
          style={{
            overflow: "hidden",
          }}
        >
          <PerfectScrollBar
            className="update-model-changelog"
            style={{
              overflowX: "hidden",
            }}
          >
            <div
              className="inner"
              dangerouslySetInnerHTML={{
                __html: changelog?.replaceAll("\n", "<br/>"),
              }}
            ></div>
          </PerfectScrollBar>
        </div>

        <div className="placeholder">
          {showDownloadProgress && renderDownloadProgress()}
        </div>

        <div className="footer-btns">{renderButtons()}</div>

        {/* <div className="footer-second">
          <a className="link" target="_blank" href={websiteUrl}>
            前往下载
          </a>
        </div> */}
      </div>
    </Modal>
  );
};

export default UpdateModal;
