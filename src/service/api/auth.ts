import { request } from '../request';

/**
 * 用户登录
 *
 * @param params Login parameters
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginResponse>({
    data: params,
    method: 'post',
    url: '/auth/login'
  });
}

/** 获取登录用户信息 */
export function fetchGetUserInfo() {
  return request<Api.Auth.LoginUserInfo>({ url: '/auth/getLoginUserInfo' });
}

/** 获取用户路由信息 */
export function fetchGetSystemRoutes() {
  return request<Api.Auth.SystemMenuRoute>({ url: '/auth/getSystemRoutes' });
}

/**
 * 刷新token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      refreshToken
    },
    method: 'post',
    url: '/auth/refreshToken'
  });
}
