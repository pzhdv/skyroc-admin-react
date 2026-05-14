import type { RequestInstance } from '@sa/axios';
import { BACKEND_ERROR_CODE } from '@sa/axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { router } from '@/features/router';
import { $t } from '@/locales';

import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

/** - 后端错误处理 */
export async function backEndFail(
  response: AxiosResponse<App.Service.Response<unknown>, any>,
  instance: AxiosInstance,
  request: RequestInstance<RequestInstanceState>
) {
  const responseCode = String(response.data.code);

  function handleLogout() {
    const location = router.reactRouter.state.location;
    const fullPath = location.pathname + location.search + location.hash;
    router.push('/login-out', { query: { redirect: fullPath } });
  }

  function logoutAndCleanup() {
    handleLogout();
    window.removeEventListener('beforeunload', handleLogout);

    request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.message);
  }

  // 当后端返回的错误码在 `logoutCodes` 列表中时，代表需要登出用户并跳转到登录页
  const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
  if (logoutCodes.includes(responseCode)) {
    handleLogout();
    return null;
  }

  // 当后端返回的错误码在 `modalLogoutCodes` 列表中时，代表需要通过弹窗提示并登出用户
  const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
  if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(response.data.message)) {
    request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.message];

    // 阻止用户刷新页面
    window.addEventListener('beforeunload', handleLogout);

    window.$modal?.error({
      content: response.data.message,
      keyboard: false,
      maskClosable: false,
      okText: $t('common.confirm'),
      onClose() {
        logoutAndCleanup();
      },
      onOk() {
        logoutAndCleanup();
      },
      title: $t('common.error')
    });

    return null;
  }

  // 当后端返回的错误码在 `expiredTokenCodes` 列表中时，代表令牌已过期，需要刷新令牌
  // 注意：刷新令牌的接口 `refreshToken` 不能返回 `expiredTokenCodes` 中的错误码，否则会造成死循环
  // 该接口应返回 `logoutCodes` 或 `modalLogoutCodes` 中的错误码
  const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
  if (expiredTokenCodes.includes(responseCode)) {
    const success = await handleExpiredRequest(request.state);
    if (success) {
      const Authorization = getAuthorization();
      Object.assign(response.config.headers, { Authorization });

      return instance.request(response.config) as Promise<AxiosResponse>;
    }
  }

  return null;
}

/** - 网络错误处理 */
export function handleError(
  error: AxiosError<App.Service.Response<unknown>, any>,
  request: RequestInstance<RequestInstanceState>
) {
  // 请求失败时，可在此处展示错误提示信息

  let message = error.message;
  let backendErrorCode = '';

  // 获取后端返回的错误信息和错误码
  if (error.code === BACKEND_ERROR_CODE) {
    message = error.response?.data?.message || message;
    backendErrorCode = String(error.response?.data?.code || '');
  }

  // 以下错误码对应的错误信息会通过弹窗展示，此处无需重复处理
  const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
  if (modalLogoutCodes.includes(backendErrorCode)) {
    return;
  }

  // 令牌过期时会自动刷新并重试请求，因此无需展示错误信息
  const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
  if (expiredTokenCodes.includes(backendErrorCode)) {
    return;
  }

  showErrorMsg(request.state, message);
}
