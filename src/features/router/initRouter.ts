import type { RouteObject } from 'react-router-dom';

import { authRoutes } from '@/router';
import { fetchGetSystemRoutes } from '@/service/api';
import { QUERY_KEYS } from '@/service/keys';
import { queryClient } from '@/service/queryClient';
import { store } from '@/store';

import { getUserInfo } from '../auth/shared';

import { transformMenuListToBackendRoutes } from './menu-to-route';
import { setCacheRoutes, setHomePath } from './routeStore';
import { filterAuthRoutesByRoles, mergeValuesByParent, transformBackendRoutesToReactRoutes } from './shared';

export async function initAuthRoutes(addRoutes: (parent: string | null, route: RouteObject[]) => void) {
  const authRouteMode = import.meta.env.VITE_AUTH_ROUTE_MODE;

  const reactAuthRoutes = mergeValuesByParent(authRoutes);

  // 从 queryClient 缓存或 localStorage 获取用户信息（登录时已保存，无需重复请求）
  const userInfo = queryClient.getQueryData<Api.Auth.LoginUserInfo>(QUERY_KEYS.AUTH.USER_INFO) || getUserInfo();

  const isSuper = userInfo?.roles.includes(import.meta.env.VITE_STATIC_SUPER_ROLE);

  // 静态模式
  if (authRouteMode === 'static') {
    // 超级管理员
    if (isSuper) {
      reactAuthRoutes.forEach(route => {
        addRoutes(route.parent, route.route);
      });
    } else {
      // 非超级管理员
      const filteredRoutes = filterAuthRoutesByRoles(reactAuthRoutes, userInfo?.roles || []);

      filteredRoutes.forEach(({ parent, route }) => {
        addRoutes(parent, route);
      });
    }
  } else {
    // 动态模式
    try {
      //  获取系统菜单路由数据，缓存不存在时自动请求接口
      const resData = await queryClient.ensureQueryData<Api.Auth.SystemMenuRoute>({
        gcTime: Infinity, // 永久缓存，不被垃圾回收
        queryFn: fetchGetSystemRoutes, // 获取系统路由的请求方法
        queryKey: QUERY_KEYS.ROUTE.USER_ROUTES, // 缓存唯一key
        staleTime: Infinity // 数据永不过期，不重新请求
      });

      // 转换菜单列表为后端路由格式
      const backendRoutes = transformMenuListToBackendRoutes(resData.routes);

      const data = { home: resData.home, routes: backendRoutes };

      store.dispatch(setHomePath(data.home));

      const routeParentMap = new Map<string, string | null>();

      function collectParentInfo(routes: Api.Route.BackendRoute[], parent: string | null = null) {
        routes.forEach(route => {
          const routeParent = route.layout !== undefined ? route.layout : parent;
          routeParentMap.set(route.name, routeParent ?? null);
        });
      }

      collectParentInfo(data.routes, '(base)');

      // 将后端路由结构转换为 React Router 路由结构
      const { cacheRoutes, routes: reactRoutes } = transformBackendRoutesToReactRoutes(data.routes);

      // 设置缓存路由
      if (cacheRoutes.length > 0) {
        store.dispatch(setCacheRoutes(cacheRoutes));
      }

      reactRoutes.forEach(routeArray => {
        const parent = routeParentMap.get(routeArray.id as string);
        if (parent) {
          addRoutes(parent, [routeArray]);
        } else {
          addRoutes(null, [routeArray]);
        }
      });
    } catch (error) {
      // 路由初始化失败是严重错误，需要记录日志
      // eslint-disable-next-line no-console
      console.error('Failed to initialize auth routes:', error);
      window.$message?.error('路由初始化失败，请刷新页面重试');
    }
  }
}
