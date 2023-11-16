declare global {
  var window: Electron.BrowserWindow;

  /**
   * @deprecated You MUST use `IProductService` whenever possible.
   */
  var _VSCODE_PRODUCT_JSON: Record<string, any>;
  /**
   * @deprecated You MUST use `IProductService` whenever possible.
   */
  var _VSCODE_PACKAGE_JSON: Record<string, any>;
}

// fake export to make global work
export {};
