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

// /** 创建 Demo 服务的请求实例 基于全局配置的 demo 服务 baseURL，包含完整的请求/响应/错误拦截逻辑 */
// export const demoRequest = createRequest<App.Service.DemoResponse>(
//   // 第一部分：请求基础配置
//   {
//     // 设置 Demo 服务的基础 URL（来自全局多服务地址配置）
//     baseURL: globalConfig.serviceOtherBaseURL.demo
//   },

//   // 第二部分：请求拦截器 & 响应处理 & 错误处理
//   {
//     /**
//      * 判断后端请求是否成功
//      *
//      * @param response 后端原始响应
//      */
//     isBackendSuccess(response) {
//       // 自定义成功逻辑：当后端返回 status === "200" 时表示业务成功
//       // 可根据自己项目后端的字段修改（如 code、success 等）
//       return response.data.status === '200';
//     },

//     /**
//      * 后端业务失败时的处理逻辑
//      *
//      * @param _response 后端原始响应
//      */
//     async onBackendFail(_response) {
//       // 后端返回非成功状态码时执行（如 token 过期、权限不足、业务异常）
//       // 可在此处做：刷新 token、重新登录、跳转页面、重试请求等
//     },

//     /**
//      * 请求发生错误时的统一处理（网络错误、超时、404、500等）
//      *
//      * @param error 错误对象
//      */
//     onError(error) {
//       // 默认错误提示信息
//       let message = error.message;

//       // 如果是后端业务错误，优先使用后端返回的错误信息
//       if (error.code === BACKEND_ERROR_CODE) {
//         message = error.response?.data?.message || message;
//       }

//       // 全局弹出错误提示
//       window.$message?.error(message);
//     },

//     /**
//      * 请求发送前的拦截处理
//      *
//      * @param config 请求配置
//      */
//     async onRequest(config) {
//       const { headers } = config;

//       // 从本地存储获取 token，并添加到请求头 Authorization
//       const token = localStg.get('token');
//       const Authorization = token ? `Bearer ${token}` : null;

//       // 将 token 注入请求头
//       Object.assign(headers, { Authorization });

//       return config;
//     },

//     /**
//      * 格式化后端响应数据，只返回需要的业务数据
//      *
//      * @param response 后端原始响应
//      */
//     transformBackendResponse(response) {
//       // 只返回 result 字段，业务代码直接拿到数据，无需每次解构
//       return response.data.result;
//     }
//   }
// );
