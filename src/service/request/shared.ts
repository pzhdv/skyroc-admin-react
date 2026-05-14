import { router } from '@/features/router';
import { localStg } from '@/utils/storage';

import { fetchRefreshToken } from '../api';

import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/**
 * 刷新令牌
 *
 * @param axiosConfig - 令牌过期时的请求配置
 */
export async function handleRefreshToken() {
  const refreshToken = localStg.get('refreshToken') || '';
  try {
    const data = await fetchRefreshToken(refreshToken);
    localStg.set('token', data.refreshToken);
    localStg.set('refreshToken', data.refreshToken);
    return true;
  } catch {
    const location = router.reactRouter.state.location;
    const fullPath = location.pathname + location.search + location.hash;
    router.push('/login-out', { query: { redirect: fullPath } });
    return false;
  }
}

/**
 * 处理令牌过期的请求
 *
 * @param state - 请求实例的状态对象
 */
export async function handleExpiredRequest(state: RequestInstanceState) {
  // 防止重复触发令牌刷新
  if (!state.refreshTokenFn) {
    state.refreshTokenFn = handleRefreshToken();
  }

  const success = await state.refreshTokenFn;

  // 1秒后清空刷新令牌的函数引用，避免缓存影响后续请求
  setTimeout(() => {
    state.refreshTokenFn = null;
  }, 1000);

  return success;
}

/**
 * 展示错误提示信息
 *
 * @param state - 请求实例的状态对象
 * @param message - 错误提示文本
 */
export function showErrorMsg(state: RequestInstanceState, message: string) {
  // 初始化错误信息栈
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  // 检查错误信息是否已存在，避免重复提示
  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error({
      content: message,
      onClose: () => {
        // 关闭提示时移除当前错误信息
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        // 5秒后清空错误信息栈，防止内存泄漏
        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
