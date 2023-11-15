console.log("telegram preload start");

window as any;

if (!window["interceptLoader"]) {
  (window as any)["interceptLoader"] = function (
    a: any,
    o: any,
    e: any,
    s: any
  ) {
    const n = (a[e] = { exports: {} });
    return o[e].call(n.exports, n, n.exports, s), n.exports;
  };
}

console.log("window.interceptLoader", (window as any).interceptLoader);
(window as any).sessionTranslationSetting = {};

class App {
  doms = new WeakSet();

  constructor() {}

  handleEvents() {}
}

(window as any)._instance = new App();
