import { ipcRenderer } from "electron";
import { isUndefined } from "lib/common/type";

if (!window["interceptLoader"]) {
  (window as any)["interceptLoader"] = function (
    a: any,
    o: any,
    e: any,
    s: any
  ) {
    const n = (a[e] = { exports: {} });
    if (e == 65116) {
      setTimeout(() => {
        const methods = a[e].exports;
        window["__modules"] = window["__modules"] || {};
        if (!isUndefined(methods["gP"])) {
          Object.keys(methods["gP"]()).forEach((key) => {
            if (key) {
              // @ts-ignore
              window["__modules"][key] = methods["gP"]()[key];
            }
          });
        }

        window["__modules"]["addActionHandler"]("signUp", (...args: any) => {
          console.log("ActionHandler signUp", ...args);
        });

        window["__modules"]["addActionHandler"](
          "setGlobalSearchClosing",
          (...args: any) => {
            console.log("ActionHandler setGlobalSearchClosing", ...args);
          }
        );

        window["__modules"]["addActionHandler"]("apiUpdate", (...args: any) => {
          const update = args[2];
          // console.log("ActionHandler apiUpdate", update);
          if (
            update["@type"] === "updateConnectionState" &&
            update?.["connectionState"] == "connectionStateReady"
          ) {
            console.log("connectionStateReady");
          }

          if (update["@type"] === "updateCurrentUser") {
          }

          if (update["@type"] === "updateUser") {
          }
        });

        // window["__modules"]["addActionHandler"]("openChat", (...args: any) => {
        //   console.log("ActionHandler openChat", ...args);
        // });
      }, 300);
    }

    return o[e].call(n.exports, n, n.exports, s), n.exports;
  };
}

console.log("window.interceptLoader", (window as any).interceptLoader);
(window as any).sessionTranslationSetting = {};

// 对
document.addEventListener("DOMContentLoaded", () => {
  // 插入css
  const style = document.createElement("style");
  style.innerHTML = `
    .ripple-container{
      display: none;
      visibility: hidden;
      opacity: 0;
      animation: none;
      transition: none;
    }
  `;
  document.head.appendChild(style);

  const timer = setInterval(() => {
    const startTime = Date.now();
    // @ts-ignore
    const memoryUsagePercent = // @ts-ignore
      window.performance?.memory.usedJSHeapSize /
      // @ts-ignore
      window.performance?.memory.totalJSHeapSize;

    ipcRenderer
      .invoke("test-heartbeat", {
        memoryUsagePercent,
      })
      .then(() => {
        const endTime = Date.now();
        const diff = endTime - startTime;
        console.log("test-heartbeat diff: ", diff + "ms");
        if (diff >= 1000) {
          // 很卡了
          clearInterval(timer);
          alert("Telegram卡顿，即将刷新页面!!");
          window.location.reload();
        }
      });
  }, 5000);
});
