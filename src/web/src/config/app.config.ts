// 平台
export const platforms = [
  {
    name: "WhatsApp",
    url: "https://web.whatsapp.com/",
    speedTestUrl: "https://web.whatsapp.com/",
  },
  {
    name: "Telegram",
    url: "https://web.telegram.org/a",
    speedTestUrl: "https://web.whatsapp.com/",
  },
  {
    name: "Line",
    url: "chrome-extension://ophjlpahpchlmihnnnihgmmeilfjmjjc/index.html",
    speedTestUrl: "https://web.whatsapp.com/",
  },
  {
    name: "Zalo",
    url: "https://chat.zalo.me",
    speedTestUrl: "https://web.whatsapp.com/",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/direct/inbox/",
    speedTestUrl: "https://web.whatsapp.com/",
  },
  {
    name: "Messenger",
    url: "https://www.messenger.com/login/",
    speedTestUrl: "https://web.whatsapp.com/",
  },
  // {
  // 	name: "Facebook",
  // 	url: "https://www.facebook.com/",
  // },
  {
    name: "Twitter",
    url: "https://twitter.com/login",
    speedTestUrl: "https://web.whatsapp.com/",
  },
  {
    name: "Skype",
    url: "https://web.skype.com/",
    speedTestUrl: "https://web.whatsapp.com/",
  },
];

// 平台名称类型
export type AppNameEnum =
  | "WhatsApp"
  | "Telegram"
  | "Line"
  | "Instagram"
  | "Messenger"
  | "Facebook"
  | "Twitter"
  | "Discord"
  | "Tiktok"
  | "Google Voice"
  | "Skype"
  | "Quora"
  | "Zalo";

// 所有的用户名
export const allAppNames = [
  "WhatsApp",
  "Telegram",
  "Line",
  "Instagram",
  "Messenger",
  "Facebook",
  "Twitter",
  "Discord",
  "Tiktok",
  "Google Voice",
  "Skype",
  "Quora",
  "Zalo",
];

/**
 * 获取平台的url
 * @param appName
 * @returns
 */
export function getUrlByAppName(appName: AppNameEnum) {
  const app = platforms.find((item) => item.name === appName);
  if (app) {
    return app.url;
  }
  return "";
}

export function getSpeedTestUrlByAppName(appName: AppNameEnum) {
  const app = platforms.find((item) => item.name === appName);
  if (app) {
    return app.speedTestUrl;
  }
  return "";
}
