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

    view.webContents.loadURL(url);
    view.webContents.executeJavaScript(`
      window.name = "${containerId}";
      console.log(name);

      document.addEventListener("visibilitychange", () => {
        console.log("visibilitychange", document.visibilityState);
      });
    `);

    (global?.window as BrowserWindow)?.setBrowserView(view);
    this.registerListeners();
  }

  /**
   * Handle events
   */
  private registerListeners() {
    this._view.webContents.on("will-prevent-unload", (event) => {
      console.log("will-prevent-unload");
      event.preventDefault();
    });

    this._view.webContents.on("did-navigate", () => {
      console.log("did-navigate");
    });

    this._view?.webContents.on("focus", () => {
      this._lastFocusTime = Date.now();
    });

    this._view?.webContents.on("content-bounds-updated", (_event, bounds) => {
      console.log("content-bounds-updated", bounds);
    });

    // 销毁事件
    this._view?.webContents?.once("destroyed", () => {
      console.log("webContents destroyed");
      this.emit("destroyed");
    });

    this._view?.webContents.on("render-process-gone", (_event, details) => {
      console.error(details);
      dialog.showErrorBox(
        "Error",
        "The renderer process has crashed:" +
          details.reason +
          "\n" +
          JSON.stringify(details)
      );
    });

    this._view.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        this.fitWindow();
        this._view.webContents.openDevTools();
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

  fitWindow() {
    console.log("fitWindow");
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

  showView() {
    if (this.view?.webContents?.isDestroyed()) {
      return;
    }
    this.fitWindow();
    (global?.window as BrowserWindow)?.addBrowserView(this._view);
    (global?.window as BrowserWindow)?.setTopBrowserView(this._view);
  }

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
    this._view?.webContents?.close();
    // @ts-ignore
    this._view?.webContents?.destroy();
  }
}

const enum VisibilityState {
  NONE,
  VISIBLE,
  HIDDEN,
}
