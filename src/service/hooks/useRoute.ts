import { useQuery } from '@tanstack/react-query';

import { fetchGetBackendRoutes, fetchGetConstantRoutes, fetchIsRouteExist } from '../api';
import { QUERY_KEYS } from '../keys';

// ! 项目未使用 留着做参考

/**
 * 获取静态路由 Hook 静态路由：无需权限、所有用户都能访问的路由（如登录、404、首页等）
 *
 * @example
 *   const { data: constantRoutes, isLoading } = useConstantRoutes();
 *
 * @param enabled - 是否自动启用查询（默认：true）
 */
export function useConstantRoutes(enabled = true) {
  return useQuery({
    enabled, // 控制查询是否自动执行
    queryFn: fetchGetConstantRoutes, // 请求静态路由的接口
    queryKey: QUERY_KEYS.ROUTE.CONSTANT_ROUTES // 缓存唯一标识
  });
}

/**
 * 获取用户动态路由 Hook 动态路由：根据用户权限返回的后端路由（菜单+页面） 永久缓存，避免重复请求
 *
 * @example
 *   const { data: userRoutes, isLoading } = useUserRoutes();
 *
 * @param enabled - 是否自动启用查询（默认：true）
 */
export function useUserRoutes(enabled = true) {
  return useQuery({
    enabled, // 控制查询是否自动执行
    gcTime: Infinity, // 永久缓存，不被垃圾回收
    queryFn: fetchGetBackendRoutes, // 请求用户动态路由的接口
    queryKey: QUERY_KEYS.ROUTE.USER_ROUTES, // 缓存唯一标识
    staleTime: Infinity // 数据永不过期，不重新请求
  });
}

/**
 * 校验路由是否存在 Hook 根据路由名称检查路由是否存在，用于路由守卫判断
 *
 * @example
 *   const { data: exists } = useIsRouteExist('home');
 *
 * @param routeName - 要校验的路由名称
 * @param enabled - 是否自动启用查询（默认：true）
 */
export function useIsRouteExist(routeName: string, enabled = true) {
  return useQuery({
    enabled, // 控制查询是否自动执行
    queryFn: () => fetchIsRouteExist(routeName), // 校验路由是否存在的接口
    queryKey: QUERY_KEYS.ROUTE.IS_ROUTE_EXIST(routeName) // 带参数的缓存唯一标识
  });
}
