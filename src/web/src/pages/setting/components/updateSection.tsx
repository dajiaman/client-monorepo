import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "@arco-design/web-react";
import classNames from "classnames";
import { createSelectors } from "../../../stores";
import useUpdateStore from "../../../stores/update";
import { FC, useEffect, useState } from "react";
import { getClientVersion } from "../../../utils/version";
import { useRequest } from "ahooks";
import { useTranslation } from "react-i18next";

// 软件升级section
interface StateProps {
  value?: string;
}

const UpdateSection: FC<StateProps> = ({ value }) => {
  const { t } = useTranslation();

  // 检查更新 method
  const checkUpdate = createSelectors(useUpdateStore).use.checkUpdate();

  // 是否有更新
  const hasUpdate = createSelectors(useUpdateStore).use.hasUpdate();

  // 新版本号
  const newVersion = createSelectors(useUpdateStore).use.remoteVersion();

  // 更新信息
  const updateInfo = createSelectors(useUpdateStore).use.updateInfo();

  useEffect(() => {
    console.log("updateInfo:", updateInfo);
  }, [updateInfo]);

  // 更新详情
  const [changelog, setChangelog] = useState<string | TrustedHTML>("");

  useEffect(() => {
    console.log("hasUpdate changed:", hasUpdate);
  }, [hasUpdate]);

  // 检查更新请求
  const { loading: checkUpdating, run: checkUpdateRun } = useRequest(
    checkUpdate,
    {
      manual: true,
      onSuccess: (result, params) => {
        console.log("checkUpdate success", result);
      },
    }
  );

  // 手动检查更新
  const onCheckUpdate = () => {
    checkUpdateRun();
  };

  return (
    <div className="setting-section update-setting-section" data-value="update">
      <div className="title">{t("software-update")}</div>
      <div className="content">
        <div className="software-update-header">
          <div className="text-wrapper">
            <span className="label">
              {hasUpdate ? t("find-new-version") : t("already-latest-version")}
              <>：</>
            </span>
            <span className="version-number-text">
              {hasUpdate ? newVersion : getClientVersion()}
            </span>
          </div>

          <div className="actions">
            {checkUpdating ? (
              <>
                <Spin
                  element={
                    <LoadingOutlined
                      style={{
                        fontSize: 18,
                      }}
                      spin
                    />
                  }
                />
                <span
                  className="checking-text"
                  style={{
                    marginLeft: 8,
                  }}
                >
                  正在检查更新
                </span>
              </>
            ) : (
              <Button
                type="primary"
                className={classNames("check-update-button")}
                onClick={onCheckUpdate}
              >
                {t("check-update")}
              </Button>
            )}
          </div>
        </div>
        {changelog && (
          <div className="changelog-wrapper">
            <div className="changelog-title">{t("update-detail")}</div>
            <div
              className="changelog"
              dangerouslySetInnerHTML={{
                __html: changelog,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateSection;
