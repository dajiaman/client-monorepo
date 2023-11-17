import { BrowserWindow, dialog } from "electron";
import { ViewsService } from "./viewsService";

export class CodeWindow {
  private _window: Electron.BrowserWindow;
  get window() {
    return this._window;
  }

  private _winId: string;
  get winId() {
    return this._winId;
  }

  private _id: number;
  get id(): number {
    return this._id;
  }

  private _lastFocusTime = -1;
  get lastFocusTime(): number {
    return this._lastFocusTime;
  }

  private readyState = ReadyState.NONE;

  private viewsService: ViewsService = new ViewsService();

  constructor(
    winId: string,
    url: string,
    options: Electron.BrowserWindowConstructorOptions
  ) {
    this._winId = winId;
    const window = new BrowserWindow(options);

    window.loadURL(url);
    this._window = window;
    this._id = this._window.id;

    this._lastFocusTime = Date.now();

    this.registerListeners();
  }

  /**
   * Handle events
   */
  registerListeners() {
    // Window error conditions to handle
    this._window.on("unresponsive", () => {
      dialog.showErrorBox("Error:", "窗口无法响应");
      // this.onWindowError(WindowError.UNRESPONSIVE);
    });

    this._window.once("ready-to-show", () => {
      this._window.show();

      if (process.env.NODE_ENV === "development") {
        this._window.webContents.openDevTools();
      }
    });

    this._window.on("closed", () => {});

    this._window.webContents.on("did-finish-load", () => {});
  }

  private async destroyWindow() {
    this._window?.destroy();
  }
}

const enum ReadyState {
  /**
   * This window has not loaded anything yet
   * and this is the initial state of every
   * window.
   */
  NONE,

  /**
   * This window is navigating, either for the
   * first time or subsequent times.
   */
  NAVIGATING,

  /**
   * This window has finished loading and is ready
   * to forward IPC requests to the web contents.
   */
  READY,
}
