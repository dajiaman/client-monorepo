import classNames from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createSelectors } from "../../stores";
import useAppStore from "../../stores/app";
import useUserStore from "../../stores/user";
import "./ActivityBar.less";

interface StateProps {}

const ActivityBar: FC<StateProps> = () => {
  const { t } = useTranslation();

  // 登出方法
  const logout = useUserStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAppName, setSelectedAppName] = useState<string>("");
  const [searchParams] = useSearchParams();
  // 可用app
  const availableApps = createSelectors(useAppStore).use.availableApps();

  const showInMenuApps = useMemo(() => {
    return availableApps?.filter((item) => item.checked && item.available);
  }, [availableApps]);

  useEffect(() => {
    if (location.pathname !== "/platform") {
      (window as any)?.vscode?.ipcRenderer.invoke("hide-all-browser-view");
    }
  }, [location.pathname]);

  useEffect(() => {
    console.log("showInMenuApps:", showInMenuApps);
    console.log("availableApps", availableApps);
  }, [showInMenuApps, availableApps]);

  useEffect(() => {
    if (searchParams.get("platformName")) {
      setSelectedAppName(searchParams.get("platformName") as string);
    } else {
      setSelectedAppName("");
    }
  }, [searchParams]);

  const onLogoutUser = () => {
    logout().then(() => {
      navigate("/login?from=logout");
    });
  };

  const goToHome = () => {
    navigate("/");
  };

  const onSupportPlatformClick = () => {
    navigate("/supportPlatform");
  };

  const goToSetting = () => {
    navigate("/setting");
  };

  const platformClick = (platformName: string) => {
    navigate("/platform?platformName=" + platformName);
  };

  return (
    <div className={classNames("activitybar")}>
      <div className="content">
        <div className="composite-bar">
          <div className="action-bar vertical">
            <ul className="actions-container" role="tablist">
              <li className="action-item icon logo">
                <a className="action-label"></a>
              </li>
              <li
                className={classNames("action-item", "icon", "home", {
                  checked: location.pathname === "/",
                })}
                aria-label={t("home-page")}
                onClick={goToHome}
              >
                <a className="action-label" aria-label={t("home-page")}>
                  {t("home-page")}
                </a>
              </li>

              {showInMenuApps?.map((item) => {
                return (
                  <li
                    key={item.name}
                    className={classNames("action-item", "icon", item.name, {
                      checked:
                        location.pathname === "/platform" &&
                        selectedAppName === item.name,
                    })}
                    onClick={(e) => platformClick(item.name)}
                  >
                    <a className="action-label">{item.name}</a>
                  </li>
                );
              })}

              <li
                className={classNames(
                  "action-item",
                  "icon",
                  "supportPlatform",
                  {
                    checked: location.pathname === "/supportPlatform",
                  }
                )}
                onClick={onSupportPlatformClick}
                aria-label={t("support-platform")}
              >
                <a className="action-label" aria-label={t("support-platform")}>
                  {t("support-platform")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="action-bar vertical">
            <ul className="actions-container" role="tablist">
              {/* 设置 */}
              <li
                className={classNames("action-item", "icon", {
                  checked: location.pathname === "/setting",
                })}
                style={{
                  display: "none",
                }}
                onClick={goToSetting}
                aria-label={t("setting")}
              >
                <a className="action-label" aria-label={t("setting")}>
                  {t("setting")}
                </a>
              </li>
              <li
                className="action-item icon"
                onClick={onLogoutUser}
                aria-label={t("logout")}
              >
                <a className="action-label" aria-label={t("logout")}>
                  {t("logout")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityBar;
