import { Tag } from "@arco-design/web-react";
import classNames from "classnames";
import { debounce } from "lodash-es";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { createSelectors } from "../../stores";
import useUpdateStore from "../../stores/update";
import "./setting.less";
import AboutSection from "./components/aboutSection";
import UpdateSection from "./components/updateSection";
import LanguageSection from "./components/languageSection";
import ShortcutSection from "./components/shortcutSection";
import ThemeSection from "./components/themeSection";

/**
 * 设置页
 * @returns
 */
const Setting = () => {
  const { t } = useTranslation();

  // 是否有更新
  const hasUpdate = createSelectors(useUpdateStore).use.hasUpdate();

  const _scrollRef = useRef(null);

  // 左侧tab
  const [selectedTab, setSelectedTab] = useState("theme");
  const [allTabs] = useState([
    {
      value: "theme",
      text: t("theme"),
    },
    {
      value: "shortcut",
      text: t("shortcut"),
    },
    {
      value: "language",
      text: t("language"),
    },
    {
      value: "update",
      text: t("software-update"),
    },
    {
      value: "about",
      text: t("about"),
    },
  ]);

  // 滚动监听
  const onScroll = debounce(
    (container: HTMLElement) => {
      const scrollTop = container.scrollTop;
      // 判断当前滚动到哪个section
      const sections = document.querySelectorAll(".setting-section");
      let currentSection: HTMLElement | null = null;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const offsetTop = section.offsetTop;
        if (scrollTop >= offsetTop) {
          currentSection = section;
        }
      }
      if (currentSection) {
        const value = currentSection.getAttribute("data-value");
        console.log("value:", value);
        setSelectedTab(value!);
      }
    },
    80,
    {
      leading: true,
      trailing: true,
    }
  );

  // tab 点击切换事件
  const onNavTabClick = (tabValue: string) => {
    console.log("onMavTabClick:", tabValue, "scrollRef:", _scrollRef);
    setSelectedTab(tabValue);
    if (_scrollRef.current) {
      const section = document.querySelector(
        '.setting-section[data-value="' + tabValue + '"]'
      ) as HTMLElement;
      const top = section.offsetTop + 2;
      console.log("top:", top);
      // @ts-ignore
      _scrollRef.current._container.scrollTop = top;
    }
  };

  return (
    <div className="setting">
      <div className="setting-header">{t("setting")}</div>
      <div className="setting-content">
        <div className="left-frame">
          {allTabs.map((tab) => {
            return (
              <div
                className={classNames("sidebar-card", "select-none", {
                  selected: tab.value === selectedTab,
                })}
                key={tab.value}
                onClick={() => onNavTabClick(tab.value)}
              >
                <span className="label">{tab.text}</span>
                <span className="tag">
                  {tab.value === "update" && hasUpdate && (
                    <Tag
                      color="red"
                      style={{
                        height: "20px",
                        color: "#DD634E",
                      }}
                    >
                      {t("new-version-tip")}
                    </Tag>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <div className="right-frame">
          <PerfectScrollbar onScrollY={onScroll} ref={_scrollRef}>
            <div className="all-setting">
              {/* 主题 */}
              <ThemeSection value="theme" />

              {/* 快捷键 */}
              <ShortcutSection value="shortcut" />

              {/* 语言 */}
              <LanguageSection value="language" />

              {/* 软件更新 */}
              <UpdateSection value="update" />

              {/* 关于 */}
              <AboutSection value="about" />
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default Setting;
