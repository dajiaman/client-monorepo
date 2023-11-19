import { isUndefined } from "lib/common/type";
import EventEmitter from "events";
import { Subject, debounceTime, first, fromEvent } from "rxjs";

const authObservable$ = new Subject();
authObservable$.subscribe((authState) => {
  console.log("authObservable subscribe value:", authState);
});

const domObservable$ = new Subject<HTMLElement[]>();
domObservable$.pipe(debounceTime(250)).subscribe((doms) => {
  // 只渲染这部分的dom
  console.log("domObservable subscribe value:", doms);
});

const eventEmitter = new EventEmitter();

if (!window["interceptLoader"]) {
  (window as any)["interceptLoader"] = function (
    a: any,
    o: any,
    e: any,
    s: any
  ) {
    const n = (a[e] = { exports: {} });
    if (e == 65116) {
      setTimeout(() => {
        const methods = a[e].exports;
        window["__modules"] = window["__modules"] || {};
        if (!isUndefined(methods["gP"])) {
          Object.keys(methods["gP"]()).forEach((key) => {
            if (key) {
              // @ts-ignore
              window["__modules"][key] = methods["gP"]()[key];
            }
          });
        }

        const authState = window?.__modules?.getGlobal()?.authState;
        if (authState) {
          if (
            authState === "authorizationStateReady" &&
            window?.__modules?.getGlobal()?.currentUserId
          ) {
            authObservable$.next(true);
          }
        } else {
          authObservable$.next(false);
        }

        window["__modules"]["addActionHandler"]("signUp", (...args: any) => {
          console.log("ActionHandler signUp", ...args);
        });

        window["__modules"]["addActionHandler"](
          "setGlobalSearchClosing",
          (...args: any) => {
            console.log("ActionHandler setGlobalSearchClosing", ...args);
          }
        );

        fromEvent(eventEmitter, "updateCurrentUser")
          .pipe(first())
          .subscribe((...args: any) => {
            // 登录后获取到用户信息，算是登录成功
            console.log("updateCurrentUser subscribe", ...args);
          });

        fromEvent(eventEmitter, "updateUser")
          .pipe(first())
          .subscribe((...args: any) => {
            console.log("updateUser subscribe", ...args);
            setTimeout(() => {
              // alert("初始化完成");
            });
          });

        window["__modules"]["addActionHandler"]("apiUpdate", (...args: any) => {
          const update = args[2];
          // console.log("ActionHandler apiUpdate", update);
          if (
            update["@type"] === "updateConnectionState" &&
            update?.["connectionState"] == "connectionStateReady"
          ) {
            console.log("connectionStateReady");
          }

          if (update["@type"] === "updateCurrentUser") {
            eventEmitter.emit("updateCurrentUser", args[2]);
          }

          if (update["@type"] === "updateUser") {
            eventEmitter.emit("updateUser", args[2]);
          }
        });

        // fromEvent(eventEmitter, "openChat")
        //   .pipe(debounceTime(50))
        //   .subscribe((...args: any) => {
        //     console.log("fromEvent openChat", ...args);
        //     const list = document.querySelectorAll(".message-list-item");
        //     domObservable$.next(list as any);
        //   });

        // window["__modules"]["addActionHandler"]("openChat", (...args: any) => {
        //   console.log("ActionHandler openChat", ...args);
        //   eventEmitter.emit("openChat", args[2]);
        // });
      }, 300);
    }

    return o[e].call(n.exports, n, n.exports, s), n.exports;
  };
}

console.log("window.interceptLoader", (window as any).interceptLoader);
(window as any).sessionTranslationSetting = {};

document.addEventListener("DOMContentLoaded", () => {
  // 插入css
  const style = document.createElement("style");
  style.innerHTML = `
    .ripple-container{
      display: none;
      visibility: hidden;
      opacity: 0;
      animation: none;
      transition: none;
    }

    .message-list-item {
      transition: none !important;
    }

    .chat-item-clickable.has-rippe {
      transition: none !important;
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    // 修改css 变量
    const root = document.documentElement;
    root.style.setProperty("--slide-transition", "0s");
  }, 2000);
});
