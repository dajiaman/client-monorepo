import EventEmitter from "node:events";
import { CodeView } from "./codeView";
import { BrowserWindow } from "electron";
import { sleep } from "./utils";

export class ViewsService extends EventEmitter {
  private readonly views = new Map<string, CodeView>();

  // 当前选中
  private _selectedTabId: string = "";
  get selectedTabId() {
    return this._selectedTabId;
  }

  constructor() {
    super();

    this.registerListeners();
  }

  registerListeners() {}

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
    try {
      await createdView.startup(url);
      // 成功加载后发送事件到渲染进程中，决定是否显示在window上
    } catch (error) {
      throw error;
    }

    // 加入到map中
    this.views.set(containerId, createdView);
    // 销毁browserView
    createdView.once("destroyed", () => {
      console.log(`view ${createdView?.containerId} destroyed`);
      this.views.delete(containerId);
      console.log("views count:", this.getViewCount());
    });

    // 重启browserView
    createdView.once("relaunch", async () => {
      // 先销毁browserView
      await this.closeTab(containerId);
      // 尝试等待2s
      await sleep(2000);
      // 再重新创建一个browserView
      const relaunchView = await this.openView(containerId, url, options);
      relaunchView?.executeJavaScript(`
        window["dontNeedMock"] = true;
      `);
      this.switchTabWithId(containerId);
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

  /**
   * 切换tab
   * @param containerId
   * @returns
   */
  switchTabWithId(containerId: string) {
    const view = this.getViewByName(containerId);
    if (!view) {
      return;
    }
    this.attachContainerIfNeed(view!);
    global?.window?.setTopBrowserView(view?.view!);
    this._selectedTabId = containerId;
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

  /**
   * 关闭指定的tab
   * @param containerId
   * @returns
   */
  async closeTab(containerId: string) {
    const codeView = this.getViewByName(containerId);
    if (codeView) {
      (global?.window as BrowserWindow)?.removeBrowserView(codeView.view);
      await codeView?.destroyView();
      this.views?.delete(containerId);
      return true;
    }

    return true;
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
