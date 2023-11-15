import { Checkbox, Radio, Select } from "@arco-design/web-react";

import { FC, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../../context";
import classNames from "classnames";
import { createSelectors } from "../../../stores";
import useSettingStore from "../../../stores/setting";

interface StateProps {
  value?: string;
}

const ThemeSection: FC<StateProps> = ({ value }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(GlobalContext);

  const isFollowSystemTheme =
    createSelectors(useSettingStore).use.isFollowSystemTheme();
  const setIsFollowSystemTheme =
    createSelectors(useSettingStore).use.setIsFollowSystemTheme();

  useEffect(() => {
    // 跟随系统主题
    if (isFollowSystemTheme) {
      // 判断当前系统主题
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme && setTheme(systemTheme);
    }
  }, [isFollowSystemTheme]);

  // 跟随系统主题 change 事件
  const onFollowSystemCheckboxChange = (checked: boolean) => {
    console.log(`checked = ${checked}`);
    setIsFollowSystemTheme(checked);
  };

  // 主题切换
  const switchTheme = (value: any) => {
    setTheme && setTheme(value);
  };

  return (
    <div className="setting-section" data-value="theme">
      <div className="title">{t("theme")}</div>
      <div className="content">
        <div className="follow-system-theme-wrapper">
          <Checkbox
            onChange={onFollowSystemCheckboxChange}
            defaultChecked={isFollowSystemTheme}
          >
            {t("follow-system-theme")}
          </Checkbox>
          <div className="tip">{t("follow-system-theme-tip")}</div>
        </div>

        <div className="theme-card-wrapper">
          <div
            className={classNames("theme-card", {
              selected: theme === "light",
            })}
            onClick={(e) => switchTheme("light")}
          >
            <div className="body">a</div>
            <div className="footer">
              <Radio
                value={"light"}
                checked={theme === "light"}
                onChange={(checked) => {
                  switchTheme("light");
                }}
              >
                {t("light-theme")}
              </Radio>
            </div>
          </div>

          <div
            className={classNames("theme-card", {
              selected: theme === "dark",
            })}
            onClick={(e) => switchTheme("dark")}
          >
            <div className="body">b</div>
            <div className="footer">
              <Radio
                value={"dark"}
                checked={theme === "dark"}
                onChange={(checked) => {
                  switchTheme("dark");
                }}
              >
                {t("dark-theme")}
              </Radio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSection;
