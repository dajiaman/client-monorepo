import { BrowserWindow } from "electron";

export class CodeWindow {
  private _window: Electron.BrowserWindow;
  get window() {
    return this._window;
  }

  constructor(url: string, options: Electron.BrowserWindowConstructorOptions) {
    const window = new BrowserWindow(options);

    window.loadURL(url);
    this._window = window;

    this.handleEvents();
  }

  /**
   * Handle events
   */
  handleEvents() {
    this._window.once("ready-to-show", () => {
      this._window.show();
    });

    this._window.on("closed", () => {});

    this._window.webContents.on("did-finish-load", () => {});
  }
}
