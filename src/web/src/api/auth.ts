import { defHttp } from "../httpUtils";
import { getClientId } from "../utils/getClientId";
import { getClientVersion } from "../utils/version";

export default class AuthService {
  /**
   * 登录接口
   * @returns
   */
  static loginApi(childAccount: string) {
    const globalClientId = getClientId();
    const clientVersion = getClientVersion();

    return defHttp.post({
      url: `/service-mqtt/login/getMQTT/${childAccount.trim()}`,
      data: {
        clientId: globalClientId,
        // 客户端版本号
        version: clientVersion,
      },
    });
  }
}
