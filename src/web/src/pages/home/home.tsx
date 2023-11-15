import { useContext } from "react";
import PerfectScrollBar from "react-perfect-scrollbar";
import "./home.less";
import { Select } from "@arco-design/web-react";
import { GlobalContext } from "../../context";
import { useTranslation } from "react-i18next";

// 首页
const HomePage = () => {
  const { t } = useTranslation();
  const { setLang, lang, theme, setTheme } = useContext(GlobalContext);

  return (
    <div className="layout-content">
      <div className="layout-content-wrapper">
        <div className="home-page" style={{ overflow: "hidden" }}>
          <PerfectScrollBar>
            <div>
              <Select
                style={{
                  width: "100px",
                }}
                options={[
                  { label: "中文", value: "zh-CN" },
                  { label: "繁体", value: "zh-TW" },
                  { label: "English", value: "en-US" },
                ]}
                value={lang}
                onChange={(value) => {
                  setLang && setLang(value);
                }}
              />

              <Select
                style={{
                  marginTop: "20px",
                  width: "100px",
                }}
                options={[
                  { label: t("light-theme"), value: "light" },
                  { label: t("dark-theme"), value: "dark" },
                ]}
                value={theme}
                onChange={(value) => {
                  setTheme && setTheme(theme === "light" ? "dark" : "light");
                }}
              />
            </div>
          </PerfectScrollBar>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
