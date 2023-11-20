import { app, dialog, ipcMain, protocol } from "electron";
import { ViewsService } from "./viewsService";
import path from "node:path";
import { WindowsService } from "./windowsService";
import { sleep } from "./utils";

// @ts-ignore
global.globalObject = {
  selectedSessionId: "",
};

// app.commandLine.appendSwitch("no-sandbox");
// app.commandLine.appendSwitch("disable-gpu-sandbox");

app.commandLine.appendSwitch(
  "js-flags",
  "--expose-gc, --max-old-space-size=4096"
);
// 防止chrome 降低隐藏的渲染进程的优先级， 全局有效
app.commandLine.appendSwitch("disable-renderer-backgrounding");

protocol.registerSchemesAsPrivileged([
  {
    scheme: "http",
    privileges: {
      secure: true,
      standard: true,
      bypassCSP: true,
      corsEnabled: true,
    },
  },
  {
    scheme: "https",
    privileges: {
      secure: true,
      standard: true,
      bypassCSP: true,
      corsEnabled: true,
    },
  },
]);

const windowsService = new WindowsService();
const viewsService = new ViewsService();

app.once("ready", async () => {
  process.on("uncaughtException", (err) => {
    const { message, stack } = err;
    dialog.showErrorBox(
      "Error",
      "uncaughtException global: " + message + "\n" + stack
    );
  });

  // unhandledRejection 事件
  process.on("unhandledRejection", (err: any) => {
    dialog.showErrorBox("Error", "unhandledRejection global: " + err);
  });

  // 替代 gpu-process-crashed
  app.on("child-process-gone", (_event, details) => {
    dialog.showErrorBox(
      "Error",
      "child-process-gone: " + JSON.stringify(details)
    );
  });

  console.log("Hello from Electron!");
  const preloadPath = path.join(__dirname, "./preload.js");
  // console.log("preloadPath: ", preloadPath);

  const loadUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3001`
      : `file://${path.resolve(__dirname, "./web/index.html")}`;

  // Create a new window
  const createdWindow = await windowsService.openWindow("main", loadUrl, {
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: preloadPath,
    },
  });

  global.window = createdWindow.window;

  // resize
  createdWindow?.window?.on("resize", () => {
    if (viewsService?.getViewCount() === 0) {
      return;
    }
    viewsService.getAllViews().forEach((view) => {
      // 尺寸变化时，重新计算
      view.fitWindow();
    });
  });

  // 打开新的browserView
  ipcMain.handle("open-browser-view", async (_e, args) => {
    console.log("open-browser-view", args);
    const { sessionId } = args;

    if (!sessionId) {
      return;
    }

    // 如果存在就不打开
    if (viewsService.getViewByName(sessionId)) {
      viewsService.getViewByName(sessionId)?.fitWindow();
      return;
    }

    if (viewsService.getViewCount() > 0) {
      viewsService.hideAllViews();
    }

    const preloadPath = path.join(
      __dirname,
      "../../../dist/business/preloads/telegram/index.js"
    );

    console.log("preloadPath: ", preloadPath);
    // browserView
    try {
      const codeView = await viewsService.openView(
        sessionId,
        `https://web.telegram.org/a/`,
        {
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            javascript: true,
            additionalArguments: [`--sessionId=${sessionId}`],
            v8CacheOptions: "bypassHeatCheck",
            enableWebSQL: false,
            webgl: false,
            spellcheck: false,
            autoplayPolicy: "user-gesture-required",
            experimentalFeatures: false,
            zoomFactor: 1,
            preload: preloadPath,
          },
        }
      );

      return codeView?.containerId;
    } catch (error: any) {
      throw error;
    }
  });

  ipcMain.handle("test-heartbeat", async () => {
    return;
  });

  /**
   * 显示browserView
   */
  ipcMain.handle("show-browser-view", async (_e, args) => {
    console.log("show-browser-view", args);
    const { sessionId } = args;

    if (!sessionId) {
      return;
    }

    viewsService.switchTabWithId(sessionId);
  });

  /**
   * 关闭browserView
   */
  ipcMain.handle("close-browser-view", async (_e, args) => {
    console.log("close browser view", args);
    const { sessionId } = args;
    viewsService.closeTab(sessionId);
    return true;
  });

  /**
   * 关闭所有的browserView
   */
  ipcMain.handle("close-all-browser-view", async (_e) => {
    console.log("close-all-browser-view");
    viewsService.closeAllTabs();
    return true;
  });

  /**
   * 隐藏所有的browserView
   */
  ipcMain.handle("hide-all-browser-view", async () => {
    console.log("hide-all-browser-view");
    if (viewsService.getViewCount() > 0) {
      viewsService.hideAllViews();
    }

    await sleep(100);
    return;
  });

  /**
   * 删除browserView
   */
  ipcMain.handle("remove-view-session", async (_e, args) => {
    console.log("remove-view-session", args);
    const { sessionId } = args;
    // 1. 先销毁browserView
    await viewsService.closeTab(sessionId);
    return true;
  });
});
