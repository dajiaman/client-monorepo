import { CodeView } from "./codeView";

export class ViewsService {
  private readonly views = new Map<string, CodeView>();

  constructor() {}

  async openView(
    name: string,
    url: string,
    options: Electron.BrowserViewConstructorOptions
  ): Promise<CodeView> {
    if (this.views.has(name)) {
      return this.views.get(name)!;
    }

    const createdView = new CodeView(name, url, options);
    this.views.set(name, createdView);
    createdView.once("destroyed", () => {
      this.views.delete(name);
    });

    return createdView;
  }

  getViewByName(name: string): CodeView | undefined {
    return this.views.get(name);
  }

  getAllViews(): CodeView[] {
    return Array.from(this.views.values());
  }

  hideAllViews() {
    this.views.forEach((view) => view.hideView());
  }

  getViewCount(): number {
    return this.views.size;
  }
}
