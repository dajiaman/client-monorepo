export class SessionManager {
  session: Electron.Session | null;

  platformName: string;

  constructor(session: Electron.Session, platformName: string) {
    this.session = session;
    this.platformName = platformName;

    this.handleEvents();
  }

  handleEvents() {
    // 发送headers前，可以修改headers
    this.session?.webRequest.onBeforeSendHeaders(
      (
        details: Electron.OnBeforeSendHeadersListenerDetails,
        callback: (beforeSendResponse: Electron.BeforeSendResponse) => void
      ) => {
        callback({ requestHeaders: details.requestHeaders });
      }
    );

    //# create region

    // 拦截的url
    const filterUrls: string[] = [];

    // telegram
    filterUrls.push("https://web.telegram.org/a/main.*.js");

    this.session?.webRequest.onBeforeRequest(
      {
        urls: filterUrls,
      },
      (
        details: Electron.OnBeforeRequestListenerDetails,
        callback: (response: Electron.CallbackResponse) => void
      ) => {
        const requestUrl = details.url;
        console.log("requestUrl", requestUrl);

        if (this.platformName === "telegram") {
          if (
            requestUrl.indexOf("https://web.telegram.org/a") > -1 &&
            requestUrl.indexOf("main") > -1
          ) {
            callback({
              redirectURL: requestUrl.replace(
                "https://web.telegram.org/a/",
                "http://da-image.oss-cn-beijing.aliyuncs.com/telegram/"
              ),
            });
          }
        }
      }
    );

    // #endregion

    // 接收到headers后，可以修改headers
    this.session?.webRequest.onHeadersReceived(
      (details: Electron.OnHeadersReceivedListenerDetails, callback) => {
        if (this.platformName === "telegram") {
          if (details?.responseHeaders?.["content-security-policy"]) {
            delete details?.responseHeaders["content-security-policy"];
          }
        }

        callback({
          responseHeaders: {
            ...details.responseHeaders,
          },
        });
      }
    );
  }
}
