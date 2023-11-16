import { BrowserWindow, app, ipcMain, protocol } from "electron";
import { ViewsService } from "./viewsService";
import path from "node:path";
import { WindowsService } from "./windowsService";

// @ts-ignore
global.globalObject = {
  selectedSessionId: "",
};

// 防止chrome 降低隐藏的渲染进程的优先级， 全局有效
app.commandLine.appendSwitch("disable-renderer-backgrounding");

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: "https",
//     privileges: {
//       secure: false,
//       bypassCSP: true,
//       corsEnabled: true,
//     },
//   },
// ]);

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: "http",
//     privileges: {
//       secure: true,
//       standard: true,
//       bypassCSP: true,
//       corsEnabled: true,
//     },
//   },
// ]);

const windowsService = new WindowsService();
const viewsService = new ViewsService();

app.once("ready", async () => {
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
    await viewsService.openView(sessionId, `https://web.telegram.org/a/`, {
      webPreferences: {
        nodeIntegration: false,
        javascript: true,
        // preload: preloadPath,
      },
    });
    return true;
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
    return;
  });

  /**
   * 删除browserView
   */
  ipcMain.handle("remove-view-session", async (_e, args) => {
    console.log("remove-view-session", args);
    const { sessionId } = args;
    // 1. 先销毁browserView
    viewsService.closeTab(sessionId);
    return true;
  });
});
