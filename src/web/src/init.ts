import "./styles/index.less";
import { setClientVersion } from "./utils/version";
import { TITLEBAR_HEIGHT } from "./config";

// 一些初始化工作
async function init() {
  initCssVariable();
  setClientVersion("0.1.1");
}

init();

// css 变量
function initCssVariable() {
  // 设置css变量
  const root = document.documentElement;
  root.style.setProperty("--titlebar-height", TITLEBAR_HEIGHT + "px");
}
