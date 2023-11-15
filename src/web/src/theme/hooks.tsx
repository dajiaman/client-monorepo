import React, { createContext, useContext, useState, useMemo } from "react";

const defaultTheme = "light";
type ThemeContextType = {
  myTheme: string;
  setMyTheme: Function;
};

const ProThemeContext = createContext<ThemeContextType | null>(null);
const useProThemeContext = () => useContext(ProThemeContext);

// 主题
const ProThemeProvider = ({ children }: any) => {
  const [myTheme, setMyTheme] = useState(defaultTheme);

  const themeProvider = useMemo(
    () => ({
      myTheme,
      setMyTheme,
    }),
    [myTheme, setMyTheme]
  );
  return (
    <ProThemeContext.Provider value={themeProvider}>
      {children}
    </ProThemeContext.Provider>
  );
};

export { ProThemeProvider, useProThemeContext };
