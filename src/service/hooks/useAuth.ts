import { useMutation, useQuery } from '@tanstack/react-query';

import { localStg } from '@/utils/storage';

import { fetchGetUserInfo, fetchLogin, fetchRefreshToken } from '../api';
import { MUTATION_KEYS, QUERY_KEYS } from '../keys';

/**
 * Login hook
 *
 * @example
 *   const { mutate: login, isPending } = useLogin();
 *   login({ userName: 'admin', password: '123456' });
 */
export function useLogin() {
  return useMutation({
    mutationFn: (params: Api.Auth.LoginParams) => fetchLogin(params),
    retry: false
  });
}

/**
 * Get user info hook
 *
 * @example
 *   const { data: userInfo, isLoading } = useUserInfo();
 *
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUserInfo() {
  const hasToken = Boolean(localStg.get('token'));

  // 1. 抽离占位数据为常量，方便复用
  const defaultUserInfo: Api.Auth.LoginUserInfo = {
    /** 用户头像URL（可选）- 空字符串适配未设置头像场景，前端可渲染占位图 */
    avatar: '',
    /** 按钮权限列表 - 空数组避免遍历空指针，符合接口非空数组约束 */
    buttons: [],
    /** 用户角色列表 - 空数组表示无角色权限，前端可据此隐藏权限相关功能 */
    roles: [],
    /** 登录用户ID - 初始化为0（数字类型默认值），区分未登录/无ID状态 */
    userId: 0,
    /** 用户名 - 空字符串初始化，登录后赋值 */
    userName: '',
    /** 用户昵称 - 空字符串初始化，前端未登录时可展示「未登录」占位文案 */
    userNick: ''
  };

  const queryResult = useQuery({
    enabled: hasToken, // enabled 是控制查询是否自动执行的开关
    gcTime: Infinity,
    placeholderData: () => defaultUserInfo,
    queryFn: fetchGetUserInfo,
    queryKey: QUERY_KEYS.AUTH.USER_INFO,
    retry: false,
    staleTime: Infinity
  });

  // 2. 兜底数据：优先用真实数据 → 再用占位数据常量 → 最后空对象
  const data = queryResult.data ?? defaultUserInfo;

  // 返回整合后的结果，确保 data 不会是 undefined
  return { ...queryResult, data };
}

/**
 * Refresh token hook
 *
 * @example
 *   const { mutate: refreshToken } = useRefreshToken();
 *   refreshToken('your-refresh-token');
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => fetchRefreshToken(refreshToken),
    mutationKey: MUTATION_KEYS.AUTH.REFRESH_TOKEN
  });
}
