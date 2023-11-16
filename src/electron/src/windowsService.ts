import EventEmitter from "events";
import { CodeWindow } from "./codeWindow";

export class WindowsService extends EventEmitter {
  private readonly windows = new Map<string, CodeWindow>();

  constructor() {
    super();
  }

  async openWindow(
    winId: string,
    url: string,
    options: Electron.BrowserWindowConstructorOptions
  ): Promise<CodeWindow> {
    if (this.windows.has(winId)) {
      return this.windows.get(winId)!;
    }

    const createdWindow = new CodeWindow(winId, url, options);
    this.windows.set(winId, createdWindow);

    return createdWindow;
  }

  getWindowByWindowId(winId: string): CodeWindow | undefined {
    return this.windows.get(winId);
  }

  getAllWindows(): CodeWindow[] {
    return Array.from(this.windows.values());
  }

  getWindowCount() {
    return this.windows.size;
  }
}
