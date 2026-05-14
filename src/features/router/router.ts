import type { RouterNavigateOptions, To } from 'react-router-dom';
import { createBrowserRouter, createHashRouter, matchRoutes } from 'react-router-dom';

import { globalConfig } from '@/config';
import { initCacheRoutes, routes } from '@/router';
import { store } from '@/store';

import { getIsLogin } from '../auth/authStore';

import { initAuthRoutes } from './initRouter';
import { type LocationQueryRaw, stringifyQuery } from './query';
import { setCacheRoutes } from './routeStore';

/**
 * 根据配置创建路由实例
 *
 * 支持 history 和 hash 两种模式，由 globalConfig.routerMode 控制
 */
function createRouterInstance() {
  const routerCreator = globalConfig.routerMode === 'hash' ? createHashRouter : createBrowserRouter;

  return routerCreator;
}

/**
 * 初始化路由
 *
 * 核心功能：
 *
 * 1. 创建 React Router 实例，支持 hash 和 history 两种路由模式
 * 2. 设置路由懒加载机制（patchRoutesOnNavigation），在导航时动态加载权限路由
 * 3. 处理已登录用户的权限路由初始化
 * 4. 提供重置路由的方法（resetRoutes）
 *
 * 流程：
 *
 * - 创建 router 实例，配置 basename 和 patchRoutesOnNavigation 钩子
 * - 初始化缓存路由到 store
 * - 如果用户已登录且未 patch 过，直接加载权限路由
 *
 * @returns 包含 reactRouter 实例和 resetRoutes 方法的对象
 */
function initRouter() {
  // 标记是否已经执行过 patch，用于避免重复加载权限路由
  let isAlreadyPatch = false;

  /**
   * 判断是否需要动态加载路由权限
   *
   * 在 React Router 的 patchRoutesOnNavigation 钩子中被调用， 用于在导航时动态检测是否需要加载权限路由
   *
   * @param path - 当前导航的目标路径
   * @returns true 需要执行 patchRoutes 加载权限路由，false 无需处理
   */
  function getIsNeedPatch(path: string) {
    // 未登录状态，无需加载权限路由
    if (!getIsLogin(store.getState())) return false;

    // 已经 patch 过，无需重复加载
    if (isAlreadyPatch) return false;

    // 使用 matchRoutes 匹配当前路径是否在已有路由中
    const matchRoute = matchRoutes(routes, { pathname: path }, import.meta.env.VITE_BASE_URL);

    // 路径未匹配到任何路由，说明是动态路由，需要加载
    if (!matchRoute) return true;

    // 路径匹配到星号路由（通配符），说明是未匹配到的路径，需要加载
    if (matchRoute) {
      return matchRoute[1].route.path === '*';
    }

    return false;
  }

  const routerCreator = createRouterInstance();

  // 根据路由模式创建 router 实例
  const reactRouter = routerCreator(routes, {
    basename: import.meta.env.VITE_BASE_URL,
    // 在导航时动态修补路由，用于处理权限路由的动态加载
    patchRoutesOnNavigation: async ({ patch, path }) => {
      // 检查当前路径是否需要加载权限路由
      if (getIsNeedPatch(path)) {
        // 标记已加载，避免重复加载
        isAlreadyPatch = true;
        // 调用 initAuthRoutes 动态加载权限路由
        await initAuthRoutes(patch);
      }
    }
  });

  store.dispatch(setCacheRoutes(initCacheRoutes));

  // 如果用户已登录且尚未 patch 过路由，则直接加载权限路由
  // 处理首次加载时 patchRoutesOnNavigation 未触发的情况
  if (getIsLogin(store.getState()) && !isAlreadyPatch) {
    initAuthRoutes(reactRouter.patchRoutes);
  }

  function resetRoutes() {
    isAlreadyPatch = false;
    reactRouter._internalSetRoutes(routes);
  }

  return {
    reactRouter,
    resetRoutes
  };
}

/** 扩展的导航选项，支持 query 参数 */
type ExtendedNavigateOptions = RouterNavigateOptions & {
  query?: LocationQueryRaw;
};

/** 构建带查询参数的路径 */
function buildPathWithQuery(path: To, query?: LocationQueryRaw): To {
  if (!query) return path;

  const pathStr = typeof path === 'string' ? path : path.pathname || '';
  const search = stringifyQuery(query);

  return `${pathStr}?${search}` as To;
}

function navigator() {
  const { reactRouter, resetRoutes } = initRouter();

  async function navigate(path: To | null, options?: RouterNavigateOptions) {
    reactRouter.navigate(path, options);
  }

  function back() {
    reactRouter.navigate(-1);
  }

  function forward() {
    reactRouter.navigate(1);
  }

  function go(delta: number) {
    reactRouter.navigate(delta);
  }

  /** 替换当前历史记录并导航到新路径 支持完整的 RouterNavigateOptions 和 query 参数 */
  function replace(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...navigateOptions } = options || {};
    const finalPath = buildPathWithQuery(path, query);

    reactRouter.navigate(finalPath, { ...navigateOptions, replace: true });
  }

  function reload() {
    reactRouter.navigate(0);
  }

  function navigateUp() {
    reactRouter.navigate('..');
  }

  function goHome(options?: RouterNavigateOptions) {
    reactRouter.navigate(globalConfig.homePath, options);
  }

  /**
   * 推入新的历史记录并导航到新路径 支持完整的 RouterNavigateOptions 和 query 参数
   *
   * @example
   *   // 基础用法
   *   router.push('/users');
   *
   *   // 带查询参数
   *   router.push('/users', { query: { page: 1, size: 10 } });
   *
   *   // 带状态和选项
   *   router.push('/users', {
   *     query: { page: 1 },
   *     state: { from: 'home' },
   *     preventScrollReset: true
   *   });
   *
   *   // 替换模式（向后兼容）
   *   router.push('/users', { replace: true });
   */
  function push(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...navigateOptions } = options || {};
    const finalPath = buildPathWithQuery(path, query);

    reactRouter.navigate(finalPath, navigateOptions);
  }

  /** 导航到指定路径（navigate 的语义化别名） */
  function goTo(path: To, options?: ExtendedNavigateOptions) {
    const { query, ...navigateOptions } = options || {};
    const finalPath = buildPathWithQuery(path, query);

    reactRouter.navigate(finalPath, navigateOptions);
  }

  /** 获取当前位置信息 */
  function getLocation() {
    return reactRouter.state.location;
  }

  /** 获取当前路径名 */
  function getPathname() {
    return reactRouter.state.location.pathname;
  }

  /** 获取当前查询参数 */
  function getSearch() {
    return reactRouter.state.location.search;
  }

  /** 获取当前 hash */
  function getHash() {
    return reactRouter.state.location.hash;
  }

  /** 获取当前状态 */
  function getState() {
    return reactRouter.state.location.state;
  }

  /** 检查是否可以后退（基于浏览器历史记录） */
  function canGoBack() {
    return window.history.length > 1;
  }

  return {
    back,
    canGoBack,
    forward,
    getHash,
    getLocation,
    getPathname,
    getSearch,
    getState,
    go,
    goHome,
    goTo,
    navigate,
    navigateUp,
    push,
    reactRouter,
    reload,
    replace,
    resetRoutes
  };
}

export const router = navigator();

export type RouterContextType = Awaited<ReturnType<typeof navigator>>;
