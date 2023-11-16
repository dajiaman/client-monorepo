import { BrowserWindow, app, ipcMain, protocol } from "electron";
import { ViewsService } from "./viewsService";
import path from "node:path";

// @ts-ignore
global.globalObject = {
  selectedSessionId: "",
};

// 禁用渲染器的后台运行,可以减少后台渲染进程的资源占用
app.commandLine.appendSwitch("disable-renderer-backgrounding");

protocol.registerSchemesAsPrivileged([
  {
    scheme: "https",
    privileges: {
      secure: false,
      bypassCSP: true,
      corsEnabled: true,
    },
  },
]);

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
]);

const viewsService = new ViewsService();

app.once("ready", () => {
  console.log("Hello from Electron!");
  const preloadPath = path.join(__dirname, "./preload.js");
  // console.log("preloadPath: ", preloadPath);

  // Create a new window
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: preloadPath,
    },
  });
  // @ts-ignore
  global.window = window;

  if (process.env.NODE_ENV === "development") {
    window.loadURL(`http://localhost:3001`);
  } else {
    window.loadURL(`file://${path.resolve(__dirname, "./web/index.html")}`);
  }

  window.webContents.openDevTools();

  window.on("resize", () => {
    viewsService.getAllViews().forEach((view) => {
      view.fitWindow();
    });
  });

  window.once("ready-to-show", () => {
    console.log("ready-to-show");
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
    viewsService.openView(sessionId, `https://web.telegram.org/a/`, {
      webPreferences: {
        nodeIntegration: true,
        // contextIsolation: false,
        javascript: true,
        // preload: preloadPath,
      },
    });

    if (viewsService.getViewByName(sessionId)) {
      window.addBrowserView(viewsService.getViewByName(sessionId)?.view!);
    }
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

    if (viewsService.getViewCount() > 0) {
      viewsService.hideAllViews();
    }

    viewsService.getViewByName(sessionId)?.fitWindow();
  });

  /**
   * 关闭browserView
   */
  ipcMain.handle("close-browser-view", async (_e, args) => {
    console.log("close browser view", args);
    const { sessionId } = args;
    viewsService.getViewByName(sessionId)?.destroyView();
    return true;
  });

  /**
   * 关闭所有的browserView
   */
  ipcMain.handle("close-all-browser-view", async (_e) => {
    console.log("close-all-browser-view");
    viewsService.getAllViews().forEach((view) => {
      view.destroyView();
    });
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
    viewsService.getViewByName(sessionId)?.destroyView();
    return true;
  });
});
