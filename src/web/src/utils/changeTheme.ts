import type { ThemeKey } from "../types";

function changeTheme(theme: ThemeKey) {
  if (theme) {
    document.body.setAttribute("arco-theme", theme);
  } else {
    document.body.removeAttribute("arco-theme");
  }
}

export default changeTheme;
