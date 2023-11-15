import { BrowserView } from "electron";
import EventEmitter from "events";

export class CodeView extends EventEmitter {
  private readonly _view: Electron.BrowserView;
  get view() {
    return this._view;
  }

  constructor(
    name: string,
    url: string,
    options: Electron.BrowserViewConstructorOptions
  ) {
    super();
    // session partition
    const partitionString: string = `persist:${name}`;

    const view = new BrowserView({
      webPreferences: {
        ...options.webPreferences,
        partition: partitionString,
      },
    });

    view.webContents.session;

    view.webContents.loadURL(url);
    this._view = view;

    this.fitWindow();
    this.handleEvents();
  }

  /**
   * Handle events
   */
  handleEvents() {
    this._view.webContents.on("did-navigate", () => {
      console.log("did-navigate");
    });

    this._view.webContents.on("did-finish-load", () => {
      this._view.webContents.openDevTools();
    });
  }

  fitWindow() {
    this._view.setBounds({
      x: 302,
      y: 0,
      width: 1280 - 302,
      height: 760 - 0,
    });
  }

  hideView() {
    this._view.setBounds({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  }

  destroyView() {
    if (this._view?.webContents?.isDestroyed()) {
      return;
    }

    // @ts-ignore
    this._view.webContents.destroy();
    // @ts-ignore
    this._view.destroy();

    this.emit("destroyed");
  }
}
