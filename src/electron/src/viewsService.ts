import EventEmitter from "node:events";
import { CodeView } from "./codeView";
import { BrowserWindow } from "electron";

export class ViewsService extends EventEmitter {
  private readonly views = new Map<string, CodeView>();

  constructor() {
    super();
  }

  /**
   * 打开创建一个browserView
   * @param containerId
   * @param url
   * @param options
   * @returns
   */
  async openView(
    containerId: string,
    url: string,
    options: Electron.BrowserViewConstructorOptions
  ): Promise<CodeView> {
    if (this.views.has(containerId)) {
      const view = this.views.get(containerId)!;
      return view;
    }

    const createdView = new CodeView(containerId, url, options);
    // 加入到map中
    this.views.set(containerId, createdView);
    createdView.on("destroyed", () => {
      console.log(`view ${createdView?.containerId} destroyed`);
      this.views.delete(containerId);
      console.log("views count:", this.getViewCount());
    });

    return createdView;
  }

  /**
   *  根据name获取browserView
   * @param name
   * @returns
   */
  getViewByName(name: string): CodeView | undefined {
    return this.views.get(name);
  }

  /**
   * 获取所有的browserView
   * @returns
   */
  getAllViews(): CodeView[] {
    return Array.from(this.views.values());
  }

  /**
   * 隐藏所有的browserView
   */
  hideAllViews() {
    this.views.forEach((view) => view.hideView());
  }

  /**
   * 获取当前打开的browserView的数量
   * @returns
   */
  getViewCount(): number {
    return this.views.size;
  }

  // 切换tab
  switchTabWithId(containerId: string) {
    const view = this.getViewByName(containerId);
    if (!view) {
      return;
    }
    this.attachContainerIfNeed(view!);
    global?.window?.setTopBrowserView(view?.view!);
    this.removeAllWithoutTab(containerId);
    view?.view?.webContents?.focus();
  }

  closeAllTabs() {
    const containerIds = Array.from(this.views.keys());
    containerIds.forEach((containerId) => {
      this.closeTab(containerId);
    });
    this.views.clear();
  }

  // 关闭指定的tab
  closeTab(containerId: string) {
    const codeView = this.getViewByName(containerId);
    if (codeView) {
      (global?.window as BrowserWindow).removeBrowserView(codeView.view);
      codeView.destroyView();
      this.views.delete(containerId);
    }
  }

  /**
   * 在 window 上移除其他 BrowserView
   */
  private removeAllWithoutTab(containerId: string) {
    this.views.forEach((view) => {
      if (view.containerId !== containerId) {
        (global?.window as any)?.removeBrowserView(view.view);
      }
    });
  }

  attachContainerIfNeed(codeView: CodeView) {
    const exists = (global?.window as BrowserWindow).getBrowserViews() || [];
    for (const view of exists) {
      if (view === codeView.view) {
        return;
      }
    }

    (global?.window as BrowserWindow).addBrowserView(codeView.view);
    codeView.fitWindow();
  }
}
