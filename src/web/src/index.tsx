import ReactDOM from "react-dom/client";
import App from "./app";
import "@arco-design/web-react/dist/css/arco.css";
import "./styles/index.less";
import "./locale/i18n";
import "./init";
import { setRootSize } from "./utils/setRootSize";
import { debounce } from "lodash-es";
import { getClientId } from "./utils/getClientId";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (root) {
  getClientId();

  // 设置根节点的宽高
  setRootSize();

  window.addEventListener(
    "resize",
    debounce(() => {
      setRootSize();
    }, 50)
  );

  requestAnimationFrame(() => {
    root.render(<App />);
  });
}
