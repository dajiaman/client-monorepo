import { ContentTypeEnum, RequestEnum } from "../enum/httpEnum";
import { RequestOptions, Result } from "../types/axios";
import { getLoginToken } from "../utils/auth";
import { deepMerge } from "lib/common/deepMerge";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { VAxios } from "./Axios";
import * as AxiosLogger from "./axios-logger/index";
import { AxiosRetry } from "./axiosRetry";
import { AxiosTransform, CreateAxiosOptions } from "./axiosTransform";
import { formatRequestDate, joinTimestamp, setObjToUrlParams } from "./helper";
import { getClientVersion } from "../utils/version";
import { getBaseUrl } from "../utils/env";
import { isString } from "lib/common/type";
import { deepClone } from "lib/common/objects";

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
    } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }

    const params = config.params || {};
    const data = config.data || false;

    formatDate && data && !isString(data) && formatRequestDate(data);

    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false)
        );
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, "data") &&
          config.data &&
          (Object.keys(config.data).length > 0 ||
            config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }

    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getLoginToken();

    // 加入一些公共参数
    (config as Recordable).headers["client-version"] = getClientVersion();

    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // 加入token
      (config as Recordable).headers.loginToken = token;
    }

    return AxiosLogger.requestLogger(config);
  },
  /**
   *
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   *
   */
  transformResponseHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const rData = res.data;
    if (!rData) {
      // return '[HTTP] Request has no return value';
      throw new Error("[HTTP] Request has no return value");
    }

    //  这里 code，data，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, data } = rData;

    // 成功
    if (code === 1 || code === 200) {
      return rData;
    }

    return Promise.reject(rData);
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return AxiosLogger.responseLogger(res);
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    AxiosLogger.errorLogger(error);
    console.log("responseInterceptorsCatch", error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || "none";
    const msg: string = response?.data?.error?.message ?? "";
    const err: string = error?.toString?.() ?? "";
    let errMessage = "";

    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
      return Promise.reject(error);
    }

    try {
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        errMessage = "Timeout";
      }

      if (err?.includes("Network Error")) {
        errMessage = "Network Error";
      }

      if (errMessage) {
        if (errorMessageMode === "modal") {
        } else if (errorMessageMode === "message") {
        }
        return Promise.reject(error);
      }
    } catch (error) {
      console.log("throw error", error);
      throw new Error(error as unknown as string);
    }

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions?.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      retryRequest.retry(axiosInstance, error);

    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        authenticationScheme: "",
        timeout: 10 * 1000,

        headers: { "Content-Type": ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },

        // 数据处理方式
        transform: deepClone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "message",
          // 接口地址
          // apiUrl: globSetting.apiUrl,
          // // 接口拼接地址
          // urlPrefix: urlPrefix,
          apiUrl: getBaseUrl(),

          urlPrefix: "",

          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 3,
            waitTime: 100,
          },
        },
      },
      opt || {}
    )
  );
}

export const defHttp = createAxios();
