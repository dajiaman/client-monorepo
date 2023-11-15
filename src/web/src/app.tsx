import { ConfigProvider } from "@arco-design/web-react";
import enUS from "@arco-design/web-react/es/locale/en-US";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import zhTW from "@arco-design/web-react/es/locale/zh-TW";
import { FC, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GlobalContext } from "./context";
import RoutePage from "./router";
import "react-perfect-scrollbar/dist/css/styles.css";
import { ThemeKey } from "./types";
import changeLang from "./utils/changeLang";
import changeTheme from "./utils/changeTheme";
import { useLocalStorageState } from "ahooks";

interface StateProps {}

const App: FC<StateProps> = () => {
  const [lang, setLang] = useLocalStorageState<string | undefined>("lang", {
    defaultValue: "zh-CN",
  });
  const [theme, setTheme] = useLocalStorageState<string | undefined>("theme", {
    defaultValue: "light",
  });

  useEffect(() => {
    if (theme) {
      changeTheme(theme as ThemeKey);
    }
  }, [theme]);

  useEffect(() => {
    if (lang) {
      changeLang(lang as string);
    }
  }, [lang]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  // arco locale
  const locale = useMemo(() => {
    switch (lang) {
      case "zh-CN":
        return zhCN;
      case "en-US":
        return enUS;
      case "zh-TW":
        return zhTW;
      default:
        return enUS;
    }
  }, [lang]);

  return (
    <DndProvider backend={HTML5Backend}>
      <ConfigProvider
        locale={locale}
        componentConfig={{
          Card: {
            bordered: false,
          },
          Input: {
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: false,
          },
        }}
      >
        <GlobalContext.Provider value={contextValue}>
          <RoutePage />
        </GlobalContext.Provider>
      </ConfigProvider>
    </DndProvider>
  );
};

export default App;
