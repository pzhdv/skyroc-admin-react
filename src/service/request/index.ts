import { createRequest } from '@sa/axios';

import { globalConfig } from '@/config';

import { backEndFail, handleError } from './error';
import { getAuthorization } from './shared';
import type { RequestInstanceState } from './type';

/** 主接口请求实例 基于 @sa/axios 封装，统一处理鉴权、响应拦截、错误处理等逻辑 */
export const request = createRequest<App.Service.Response, RequestInstanceState>(
  // 基础配置项
  {
    // 接口请求基础地址（从全局配置中读取）
    baseURL: globalConfig.serviceBaseURL
    // // 固定请求头（示例：Apifox 调试令牌）
    // headers: {
    //   apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    // }
  },
  // 拦截器及自定义配置
  {
    /**
     * 判断后端响应是否成功
     *
     * 后端返回状态码为 VITE_SERVICE_SUCCESS_CODE（默认"200"）时判定为成功， 可通过修改 .env 文件中的 VITE_SERVICE_SUCCESS_CODE 自定义成功码规则
     *
     * @param response - Axios 响应对象
     * @returns 成功返回 true，失败返回 false
     */
    isBackendSuccess(response) {
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },

    /**
     * 后端响应失败时的处理逻辑（状态码非成功码）
     *
     * 调用统一的后端错误处理方法，处理登出、令牌刷新等场景
     *
     * @param response - Axios 响应对象
     * @param instance - Axios 实例
     */
    async onBackendFail(response, instance) {
      await backEndFail(response, instance, request);
    },

    /**
     * 请求错误处理（网络错误、超时等）
     *
     * 调用统一的错误处理方法，展示错误提示等
     *
     * @param error - Axios 错误对象
     */
    onError(error) {
      handleError(error, request);
    },

    /**
     * 请求发送前的拦截处理
     *
     * 统一添加鉴权令牌（Authorization）到请求头
     *
     * @param config - Axios 请求配置
     * @returns 处理后的请求配置
     */
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },

    /**
     * 后端响应数据转换
     *
     * 统一提取响应体中的 data 字段，简化业务层取值逻辑
     *
     * @param response - Axios 响应对象
     * @returns 提取后的业务数据
     */
    transformBackendResponse(response) {
      return response.data.data;
    }
  }
);
