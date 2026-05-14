import { useMutation, useQuery } from '@tanstack/react-query';

import { localStg } from '@/utils/storage';

import { fetchGetUserInfo, fetchLogin, fetchRefreshToken } from '../api';
import { MUTATION_KEYS, QUERY_KEYS } from '../keys';

/**
 * 登录 Hook 封装登录接口请求，使用 useMutation 管理异步提交状态
 *
 * @example
 *   const { mutate: login, isPending } = useLogin();
 *   login({ userName: 'admin', password: '123456' });
 */
export function useLogin() {
  return useMutation({
    mutationFn: (params: Api.Auth.LoginParams) => fetchLogin(params),
    retry: false // 登录失败不自动重试
  });
}

/**
 * 获取当前登录用户信息 Hook 依赖 token 存在自动发起请求，数据永久缓存，避免重复请求
 *
 * @example
 *   const { data: userInfo, isLoading } = useUserInfo();
 *
 * @param enabled - 是否自动启用查询（默认：true）
 */
export function useUserInfo() {
  // 判断是否存在 token，存在才自动请求用户信息
  const hasToken = Boolean(localStg.get('token'));

  /**
   * 默认用户信息占位数据 作用：
   *
   * 1. 避免 data 为 undefined 导致页面报错
   * 2. 未登录/加载中时提供安全的空数据结构
   * 3. 统一类型结构，符合 TS 类型约束
   */
  const defaultUserInfo: Api.Auth.LoginUserInfo = {
    avatar: '', // 用户头像，未设置时为空
    buttons: [], // 按钮权限码数组
    hasRoutePermission: false, // 是否有路由权限，默认 false
    homePath: '', // 默认首页路由
    roles: [], // 角色列表
    userId: 0, // 用户ID（数字类型默认值）
    userName: '', // 登录账号
    userNick: '' // 用户昵称
  };

  const queryResult = useQuery({
    enabled: hasToken, // 仅在有 token 时自动执行查询
    gcTime: Infinity, // 永久缓存，不被垃圾回收
    placeholderData: () => defaultUserInfo, // 数据未返回时使用的占位数据（不会覆盖缓存）
    queryFn: fetchGetUserInfo, // 获取用户信息的接口请求函数
    queryKey: QUERY_KEYS.AUTH.USER_INFO, // 缓存唯一标识
    retry: false, // 请求失败不自动重试
    staleTime: Infinity // 数据永不过期，不再重新请求
  });

  // 数据兜底：确保 data 永远有值，避免 undefined 报错
  const data = queryResult.data ?? defaultUserInfo;

  // 返回整合后的查询结果，保证 data 一定存在
  return { ...queryResult, data };
}

/**
 * 刷新 Token Hook 用于登录过期时，通过 refreshToken 获取新的 token
 *
 * @example
 *   const { mutate: refreshToken } = useRefreshToken();
 *   refreshToken('your-refresh-token');
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => fetchRefreshToken(refreshToken),
    mutationKey: MUTATION_KEYS.AUTH.REFRESH_TOKEN // 缓存/调试唯一标识
  });
}
