import { BrowserView, dialog } from "electron";
import EventEmitter from "events";

export class CodeView extends EventEmitter {
  private readonly _view: Electron.BrowserView;
  get view() {
    return this._view;
  }

  private _name: string;
  get name() {
    return this._name;
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
    name: string,
    url: string,
    options: Electron.BrowserViewConstructorOptions
  ) {
    super();
    this._name = name;

    // session partition
    const partitionString: string = `persist:${name}`;

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

    this._view?.webContents?.once("destroyed", () => {
      console.log("destroyed");
      this.emit("destroyed");
    });

    this._view?.webContents?.on("ipc-message", () => {
      console.log("ipc-message");
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
    // @ts-ignore
    const clientWidth = global?.window.getContentBounds().width;
    // @ts-ignore
    const clientHeight = global?.window.getContentBounds().height;
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

  hideView() {
    if (this.visibilityState === VisibilityState.HIDDEN) {
      return;
    }
    console.log("hideView", this._name);
    this._view.setBounds({
      x: -100,
      y: -100,
      width: 1,
      height: 1,
    });
    this.visibilityState = VisibilityState.HIDDEN;
  }

  async destroyView(): Promise<void> {
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
