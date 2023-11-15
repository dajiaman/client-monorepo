import { IS_DEV } from "../config";
import { defHttp } from "../httpUtils";
import { getClientVersion } from "../utils/version";

export class CommonService {
  /**
   * 检查更新
   * @returns
   */
  static checkUpdateApi(version: string = getClientVersion()) {
    if (!version) {
      return Promise.reject("version is invalid");
    }

    const appPlatform = IS_DEV ? "win32" : process.platform;
    const appArch = IS_DEV ? "x64" : process.arch;

    let platform: number;
    let arch: number;

    switch (appPlatform) {
      case "darwin":
        //  mac
        platform = 1;
        arch = 0;
        break;
      case "win32":
        // windows
        platform = 0;
        arch = appArch.indexOf("x64") !== -1 ? 1 : 0; //  除win64是1，其他都是0（32位）
        break;
      case "linux":
        // linux
        platform = 2;
        arch = 0;
        break;
      default:
        platform = 0;
        arch = 0;
        break;
    }

    return defHttp.get({
      url: "/service-mqtt/client-version/last",
      params: {
        system_type: platform,
        position_type: arch,
        version: version,
      },
    });
  }

  /**
   * 获取翻译类型
   * @returns
   */
  static getApiTranslateType() {
    return defHttp.get({
      url: "/service-mqtt/sub/getApiTranslateType",
    });
  }

  /**
   * 获取用户所有可用平台
   * @returns
   */
  static getUserInfoChannelList() {
    return defHttp.get({
      url: `/service-mqtt/sub/getUserInfoChannelList`,
    });
  }

  static getPackageInfo() {
    return defHttp.get({
      url: `/service-mqtt/sub/setMeal-residue`,
    });
  }
}
