import { InternalAxiosRequestConfig } from "axios";
import { RequestLogConfig } from "../common/types";
import { assembleBuildConfig } from "../common/config";
import StringBuilder from "../common/string-builder";

function requestLogger(
  request: InternalAxiosRequestConfig,
  config: RequestLogConfig = {}
) {
  const { baseURL, url, params, method, data, headers } = request;
  const buildConfig = assembleBuildConfig(config);

  const stringBuilder = new StringBuilder(buildConfig);
  const log = stringBuilder
    .makeLogTypeWithPrefix("Request")
    .makeDateFormat(new Date())
    .makeMethod(method)
    .makeUrl(url, baseURL)
    .makeParams(params)
    .makeHeader(headers)
    .makeData(data)
    .build();

  buildConfig.logger(log);

  return request;
}

export default requestLogger;
