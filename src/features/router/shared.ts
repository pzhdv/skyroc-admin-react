import type { RouteObject } from 'react-router-dom';
import { Outlet, replace } from 'react-router-dom';

import { layouts, pages } from '@/router/elegant/imports';

/**
 * 将后端路由结构转换为 React Router 的路由结构
 *
 * @param backendRoutes 后端返回的路由数组
 * @returns 包含路由数组和缓存路由路径数组的对象
 */
export function transformBackendRoutesToReactRoutes(backendRoutes: Api.Route.BackendRoute[]): {
  cacheRoutes: string[];
  routes: RouteObject[];
} {
  const cacheRoutes: string[] = [];
  const routes = backendRoutes.map(route => transformBackendRouteToReactRoute(route, cacheRoutes));
  return { cacheRoutes, routes };
}

/**
 * 将单个后端路由转换为 React Router 路由
 *
 * @param backendRoute 后端路由对象
 * @param cacheRoutes 用于收集需要缓存的路由路径数组
 * @returns React Router 路由对象
 */
function transformBackendRouteToReactRoute(
  backendRoute: Api.Route.BackendRoute,
  cacheRoutes: string[] = []
): RouteObject {
  const { children, component, handle, layout, name, path, redirect } = backendRoute;

  // 获取布局 key（去掉 'layout.' 前缀）
  const getLayoutKey = () => {
    if (!layout) return null;
    // 去掉 'layout.' 前缀
    return layout.startsWith('layout.') ? layout.replace(/^layout\./, '') : layout;
  };

  // 获取组件 key（去掉 'page.' 前缀）
  const getComponentKey = () => {
    if (!component) return null;
    // 去掉 'page.' 前缀
    return component.startsWith('page.') ? component.replace(/^page\./, '') : component;
  };

  const layoutKey = getLayoutKey();
  const componentKey = getComponentKey();

  // 判断是否为布局组件：如果有 layout 字段并且能在 layouts 中找到匹配
  const isLayout = layoutKey ? layouts[layoutKey] !== undefined : false;
  // 判断是否为页面组件：如果有 component 字段并且能在 pages 中找到匹配
  const isPage = componentKey ? pages[componentKey] !== undefined : false;

  // 获取组件配置
  async function getConfig() {
    // 如果是布局组件
    if (isLayout && layoutKey && layouts[layoutKey]) {
      const module = await layouts[layoutKey]!();
      return {
        action: module.action,
        Component: module.default,
        isLayout: true,
        loader: module.loader,
        shouldRevalidate: module.shouldRevalidate
      };
    }

    // 如果是页面组件
    if (isPage && componentKey && pages[componentKey]) {
      const module = await pages[componentKey]!();
      return {
        action: module.action,
        Component: module.default,
        isLayout: false,
        loader: module.loader,
        shouldRevalidate: module.shouldRevalidate
      };
    }

    return null;
  }

  // 判断是否需要添加 index 路由：有 component 但没有 layout，且有 children
  const needIndexRoute = !isLayout && isPage && children && children.length > 0;

  const reactRoute: RouteObject = {
    handle,
    id: name,
    lazy: async () => {
      // 如果需要添加 index 路由，父路由渲染 Outlet 来显示子路由
      if (needIndexRoute) {
        return {
          Component: Outlet
        };
      }
      const config = await getConfig();
      const result: any = {
        ...config
      };
      return result;
    },
    path
  };

  // 收集需要缓存的路由路径
  // 如果 needIndexRoute 为 true，实际的页面组件在 index 路由中，所以不在父路由收集
  // 如果 needIndexRoute 为 false，页面组件在当前路由中，所以在当前路由收集
  if (!needIndexRoute && handle?.keepAlive && path) {
    cacheRoutes.push(path);
  }

  // 处理子路由
  if (children && children.length > 0) {
    // 如果不是 layout，需要添加一个 index 路由来渲染 component
    if (needIndexRoute) {
      // 创建一个 index 路由，使用当前路由的 component
      const indexRoute: RouteObject = {
        handle,
        id: `${name}-index`,
        index: true,
        lazy: async () => {
          const config = await getConfig();

          const result: any = {
            ...config
          };
          if (redirect) {
            result.loader = () => replace(redirect);
          }
          return result;
        }
      };
      // 如果 index 路由有 keepAlive，使用父路由的 path 添加到缓存路由
      if (handle?.keepAlive && path) {
        cacheRoutes.push(path);
      }
      reactRoute.children = [
        indexRoute,
        ...children.map(child => transformBackendRouteToReactRoute(child, cacheRoutes))
      ];
    } else {
      reactRoute.children = children.map(child => transformBackendRouteToReactRoute(child, cacheRoutes));
    }
  }

  return reactRoute;
}

/**
 * Merge routes by parent
 *
 * @param data Auth routes
 * @returns Merged routes
 */
export function mergeValuesByParent(data: Router.SingleAuthRoute[]) {
  const merged: Record<string, Router.AuthRoute> = {};

  data.forEach(item => {
    // 使用一个变量作为 key，若 parent 为 null，则转换为字符串 "null"
    const key = item.parent === null ? 'null' : item.parent;
    if (!merged[key]) {
      merged[key] = {
        parent: item.parent, // 保持原始 parent 值，包括 null
        parentPath: item.parentPath,
        route: []
      };
    }
    merged[key].route.push(item.route);
  });
  return Object.values(merged).sort((a, b) => a.parent?.localeCompare(b.parent || '') || 0);
}

/**
 * Filter auth routes by roles
 *
 * @param routes Auth routes
 * @param roles Roles
 */
export function filterAuthRoutesByRoles(routes: { parent: string | null; route: RouteObject[] }[], roles: string[]) {
  return routes
    .map(item => {
      // 过滤 route 数组
      if (item.route[0]?.index) {
        const routeRoles: string[] = (item.route[0].handle && item.route[0].handle.roles) || [];
        const hasPermission = routeRoles.some(role => roles.includes(role));
        const isEmptyRoles = !routeRoles.length;

        if (!isEmptyRoles && !hasPermission) {
          return {
            parent: item.parent,
            route: []
          };
        }
      }

      const filteredRoute = item.route.filter(routeObj => {
        const routeRoles: string[] = (routeObj.handle && routeObj.handle.roles) || [];

        // if the route's "roles" is empty, then it is allowed to access
        const isEmptyRoles = !routeRoles.length;

        // if the user's role is included in the route's "roles", then it is allowed to access
        const hasPermission = routeRoles.some(role => roles.includes(role));

        return hasPermission || isEmptyRoles;
      });

      // 返回结构与原始一致，但 route 已经过滤过
      return {
        parent: item.parent,
        route: filteredRoute
      };
    })
    .filter(item => item.route.length >= 1);
}

export function filterAuthRoutesByDynamic(routes: Router.AuthRoute[], hasRoutes: string[]) {
  return routes
    .map(item => {
      // 过滤 route 数组
      const filteredRoute = item.route.filter(routeObj => {
        if (routeObj?.index && hasRoutes.includes(item?.parentPath || '')) {
          return true;
        }
        return hasRoutes.includes(routeObj.path || '');
      });

      // 返回结构与原始一致，但 route 已经过滤过
      return {
        parent: item.parent,
        route: filteredRoute
      };
    })
    .filter(item => item.route.length >= 1);
}
