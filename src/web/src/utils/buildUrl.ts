import { isEmptyObject } from "lib/common/type";
import qs from "qs";
import store from "store";

/**
 * 构造带查询参数的url
 * @param url
 * @param queryParams
 */
export function buildUrlWithQuery(
  url: string,
  queryParams: Record<string, any> = {}
) {
  // 如果没有查询参数，直接返回url
  if (!queryParams || isEmptyObject(queryParams)) {
    queryParams = { language: store.get("language", "zh-CN") };
  }

  // 如果有查询参数，构造查询参数
  const query = qs.stringify(queryParams, { arrayFormat: "repeat" });

  if (query.length === 0) {
    return url;
  }

  // 如果url中有查询参数，直接返回
  if (url.indexOf("?") >= 0) {
    return `${url}&${query}`;
  }

  // 如果url中没有查询参数，添加查询参数
  return `${url}?${query}`;
}
