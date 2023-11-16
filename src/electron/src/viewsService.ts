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
    createdView.on("destroy", () => {
      console.log(`view ${createdView?.name} destroyed`);
      this.views.delete(name);
      console.log("views count:", this.getViewCount());
    });

    return createdView;
  }

  /**
   * 关闭所有的browserView
   */
  removeAllViews() {
    this.views.forEach((view) => view?.destroyView());
    this.views.clear();
  }

  getViewByName(name: string): CodeView | undefined {
    return this.views.get(name);
  }

  getAllViews(): CodeView[] {
    return Array.from(this.views.values());
  }

  /**
   * 隐藏所有的browserView
   */
  hideAllViews() {
    this.views.forEach((view) => view.hideView());
  }

  getViewCount(): number {
    return this.views.size;
  }
}
