import { buildUrlWithQuery } from "./buildUrl";

// 不同的环境变量
const configs = <IEnvConfig>{
  development: {
    // 服务器地址
    // apiUrl: 'http://testmqtt.funcode.live/',
    // apiUrl: "http://192.168.130.151:4881",

    apiUrl: "https://mock.apifox.com/m1/3564554-0-default",

    // 帮助文档地址
    helpUrl: "https://www.chatknow.com/help",
    // 官网
    websiteUrl: "https://www.chatknow.com/",
    // 下载页面
    downloadUrl: "https://www.chatknow.com/download",
    // 用户中心
    userCenterUrl: "http://test.user.funcode.live/#/memberLogin",
  },
  test: {
    // apiUrl: 'https://testmqtt.funcode.live',
    apiUrl: "http://192.168.130.151:4881",
    helpUrl: "https://www.chatknow.com/help",
    websiteUrl: "https://www.chatknow.com/",
    downloadUrl: "https://www.chatknow.com/download",
    userCenterUrl: "http://test.user.funcode.live/#/memberLogin",
  },
  production: {
    apiUrl: "https://mock.apifox.com/m1/3564554-0-default",
    helpUrl: "https://www.chatknow.com/help",
    websiteUrl: "https://www.chatknow.com",
    downloadUrl: "https://www.chatknow.com/download",
    userCenterUrl: "https://user.chatknow.com/#/memberLogin",
  },
};

export default configs;

interface IEnvConfig {
  [env: string]: IConfig;
}

interface IConfig {
  // 服务器域名
  apiUrl: string;
  // 帮助文档地址
  helpUrl: string;
  // 官网
  websiteUrl: string;
  // 下载页面
  downloadUrl: string;
  // 用户中心
  userCenterUrl: string;
}

type EnvEnum = "test" | "development" | "production";

/**
 * 获取环境配置
 * @param env {EnvEnum} 环境
 * @returns
 */
export function getEnvConfig(
  env: EnvEnum = process.env.APP_ENV as EnvEnum
): IConfig {
  if (Object.keys(configs).includes(env)) {
    return configs[env];
  }

  // 没有就直接返回生产环境的配置
  return configs.production;
}

/**
 * 获取地址
 * @returns
 */
export function getBaseUrl(
  env: EnvEnum = process.env.APP_ENV as EnvEnum
): string {
  if (Object.keys(configs).includes(env)) {
    return configs[env].apiUrl;
  }

  return configs?.production.apiUrl;
}

/**
 * 获取地址
 *
 * @param key
 * @param env
 * @returns
 */
export function getUrlFromEnvConfig(
  key: keyof IConfig,
  queryParams: Record<string, any> = {},
  env: EnvEnum = process.env.APP_ENV as EnvEnum
) {
  if (Object.keys(configs).includes(env)) {
    return buildUrlWithQuery(configs[env][key], queryParams);
  }

  return buildUrlWithQuery(configs[env][key], queryParams);
}
