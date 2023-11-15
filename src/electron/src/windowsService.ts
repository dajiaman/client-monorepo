import { CodeWindow } from "./codeWindow";

export class WindowsService {
  private readonly windows = new Map<string, CodeWindow>();

  constructor() {}

  async openWindow(
    name: string,
    url: string,
    options: Electron.BrowserWindowConstructorOptions
  ): Promise<CodeWindow> {
    if (this.windows.has(name)) {
      return this.windows.get(name)!;
    }

    const createdWindow = new CodeWindow(url, options);
    this.windows.set(name, createdWindow);
    return createdWindow;
  }


}
