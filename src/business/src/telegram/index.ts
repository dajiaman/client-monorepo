console.log("telegram preload start");
import { Subject } from "rxjs";

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

// 登录observable
const authStateObservable$ = new Subject();
authStateObservable$.subscribe((hasLogin) => {
  console.log("hasLogin:", hasLogin);
  if (hasLogin) {
  } else {
  }
});

setTimeout(() => {
  authStateObservable$.next(false);

  setTimeout(() => {
    authStateObservable$.next(true);
  }, 1000);
}, 1000);

class App {
  doms = new WeakSet();

  constructor() {}

  handleEvents() {}
}

(window as any)._instance = new App();
