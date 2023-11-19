import { IpcRenderer, ProcessMemoryInfo, WebFrame } from "./electronTypes";

export interface IpcMessagePort {
  /**
   * Acquire a `MessagePort`. The main process will transfer the port over to
   * the `responseChannel` with a payload of `requestNonce` so that the source can
   * correlate the response.
   *
   * The source should install a `window.on('message')` listener, ensuring `e.data`
   * matches `nonce`, `e.source` matches `window` and then receiving the `MessagePort`
   * via `e.ports[0]`.
   */
  acquire(responseChannel: string, nonce: string): void;
}

const vscodeGlobal = (globalThis as any).vscode;
export const ipcRenderer: IpcRenderer = vscodeGlobal.ipcRenderer;
export const ipcMessagePort: IpcMessagePort = vscodeGlobal.ipcMessagePort;
export const webFrame: WebFrame = vscodeGlobal.webFrame;

declare global {
  interface Window {
    vscode: typeof vscodeGlobal;
  }
}

// fake export to make global work
export {};
