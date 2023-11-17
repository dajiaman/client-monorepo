import { BrowserView, BrowserWindow, dialog } from "electron";
import EventEmitter from "events";

export class CodeView extends EventEmitter {
  private readonly _view: Electron.BrowserView;
  get view() {
    return this._view;
  }

  private _containerId: string;
  get containerId() {
    return this._containerId;
  }

  private _id: number;
  get id(): number {
    return this._id;
  }

  private _lastFocusTime = -1;
  get lastFocusTime(): number {
    return this._lastFocusTime;
  }

  private visibilityState = VisibilityState.NONE;

  constructor(
    containerId: string,
    url: string,
    options: Electron.BrowserViewConstructorOptions
  ) {
    super();
    this._containerId = containerId;

    // session partition
    const partitionString: string = `persist:${containerId}`;

    const view = new BrowserView({
      webPreferences: {
        ...options.webPreferences,
        partition: partitionString,
      },
    });

    this._view = view;
    this._id = this._view.webContents.id;
    this._lastFocusTime = Date.now();
    this.fitWindow();

    this._view?.webContents.loadURL(url);

    (global?.window as BrowserWindow)?.setBrowserView(view);

    this._view?.webContents.executeJavaScript(`
      window.name = "${containerId}";
      console.log('name:', name);
      document.addEventListener("visibilitychange", () => {
        console.log("visibilitychange", document.visibilityState);
      });
    `);

    // 模拟内存泄漏
    // setTimeout(() => {
    //   console.log("模拟内存泄漏");
    //   this._view?.webContents.executeJavaScript(`
    //     console.log('模拟内存泄漏');
    //     for (let i = 1; i < 99999999; i++) {
    //         const dom = document.createElement("div");
    //         document.body.appendChild(dom);
    //     }
    //   `);
    // }, 5000);

    this.registerListeners();
  }

  /**
   * 重启
   */
  reLaunch() {
    this.emit("relauch", {
      containerId: this.containerId,
    });

    //   // 无效 强制终止渲染器进程，以帮助恢复挂起的渲染器/ 会导致连续崩溃
    //   this?._view?.webContents?.forcefullyCrashRenderer();
    //   this._view?.webContents.reload();
  }

  /**
   * Handle events
   */
  private registerListeners() {
    this._view.webContents.on("will-prevent-unload", (event) => {
      console.log("will-prevent-unload");
      event.preventDefault();
    });

    this._view?.webContents?.once("render-process-gone", (_event, details) => {
      dialog.showErrorBox(
        "Error",
        `${this.containerId} 渲染进程崩溃，将会自动重新加载:` +
          details.reason +
          "\n" +
          JSON.stringify(details)
      );

      this.reLaunch();
    });

    this._view?.webContents?.on("unresponsive", () => {
      dialog.showErrorBox(
        "Error:",
        `${this.containerId} 渲染进程无法响应，将会自动重新加载`
      );
      this.reLaunch();
    });

    this._view.webContents.on("did-navigate", () => {
      console.log("did-navigate");
    });

    this._view?.webContents.on("focus", () => {
      console.log("focus", this.containerId);
      if (
        this._view?.webContents?.isCrashed() ||
        this._view?.webContents?.isDestroyed()
      ) {
        return;
      }
      this._lastFocusTime = Date.now();
    });

    this._view?.webContents.on("blur", () => {
      console.log("blur", this.containerId);
      if (this._view?.webContents?.isDestroyed()) {
        return;
      }
    });

    // 销毁事件
    this._view?.webContents?.once("destroyed", () => {
      console.log("webContents destroyed");
      this.emit("destroyed");
    });

    this._view.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        this.fitWindow();

        if (process.env.NODE_ENV === "development") {
          this._view.webContents.openDevTools();
        }
      });
    });
  }

  /**
   * 执行 JS 方法
   */
  public executeJavaScript(script: string) {
    if (this._view?.webContents?.isDestroyed()) {
      return;
    }
    return this._view?.webContents?.executeJavaScript(script).catch((error) => {
      console.error(error);
    });
  }

  forceGc() {
    if (this._view?.webContents?.isDestroyed()) {
      return;
    }
    this.executeJavaScript(`global.gc && global.gc();`);
  }

  /**
   * 适应窗口
   */
  fitWindow() {
    const clientWidth = global?.window?.getContentBounds().width;
    const clientHeight = global?.window?.getContentBounds().height;
    this._view.setBounds({
      x: 302,
      y: 0,
      width: clientWidth - 302,
      height: clientHeight - 0,
    });
    this._view.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });
    this.visibilityState = VisibilityState.VISIBLE;
  }

  /**
   * 显示视图
   * @returns
   */
  showView() {
    if (this.view?.webContents?.isDestroyed()) {
      return;
    }
    this.fitWindow();
    (global?.window as BrowserWindow)?.addBrowserView(this._view);
    (global?.window as BrowserWindow)?.setTopBrowserView(this._view);
  }

  /**
   * 隐藏视图
   * @returns
   */
  hideView() {
    if (this.view?.webContents?.isDestroyed()) {
      return;
    }
    if (this.visibilityState === VisibilityState.HIDDEN) {
      return;
    }
    console.log("hideView", this.containerId);
    (global?.window as BrowserWindow)?.removeBrowserView(this._view);
    this.visibilityState = VisibilityState.HIDDEN;
  }

  async destroyView(): Promise<void> {
    (global?.window as BrowserWindow)?.removeBrowserView(this._view);
    if (this._view?.webContents?.isDestroyed()) {
      return;
    }

    this._view?.webContents?.close();
    try {
      // @ts-ignore
      this._view?.webContents?.destroy();
    } catch (error) {}
  }
}

const enum VisibilityState {
  NONE,
  VISIBLE,
  HIDDEN,
}
