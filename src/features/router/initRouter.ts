import type { RouteObject } from 'react-router-dom';

import { authRoutes } from '@/router';
import { fetchGetSystemRoutes, fetchGetUserInfo } from '@/service/api';
import { QUERY_KEYS } from '@/service/keys';
import { queryClient } from '@/service/queryClient';
import { store } from '@/store';

import { transformMenuListToBackendRoutes } from './menu-to-route';
import { setCacheRoutes, setHomePath } from './routeStore';
import { filterAuthRoutesByRoles, mergeValuesByParent, transformBackendRoutesToReactRoutes } from './shared';

export async function initAuthRoutes(addRoutes: (parent: string | null, route: RouteObject[]) => void) {
  const authRouteMode = import.meta.env.VITE_AUTH_ROUTE_MODE;

  const reactAuthRoutes = mergeValuesByParent(authRoutes);

  const userInfo = await queryClient.ensureQueryData<Api.Auth.LoginUserInfo>({
    queryFn: fetchGetUserInfo,
    queryKey: QUERY_KEYS.AUTH.USER_INFO
  });

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
      // const data = await queryClient.ensureQueryData<Api.Route.BackendRouteResponse>({
      //   gcTime: Infinity,
      //   queryFn: fetchGetBackendRoutes,
      //   queryKey: QUERY_KEYS.ROUTE.USER_ROUTES,
      //   staleTime: Infinity
      // });

      // const resData = await queryClient.ensureQueryData<Api.Auth.SystemMenuRoute>({
      //   gcTime: Infinity,
      //   queryFn: fetchGetSystemRoutes,
      //   queryKey: QUERY_KEYS.ROUTE.USER_ROUTES,
      //   staleTime: Infinity
      // });

      const resData = await fetchGetSystemRoutes();
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
