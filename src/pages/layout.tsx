import type { RoutePath } from '@soybean-react/vite-plugin-react-router';
import { Outlet, matchRoutes } from 'react-router-dom';

import { usePrevious, useRoute } from '@/features/router';
import { allRoutes } from '@/router';
import { fetchGetUserInfo } from '@/service/api/auth.ts';
import { useUserInfo } from '@/service/hooks';
import { QUERY_KEYS } from '@/service/keys/index.ts';
import { queryClient } from '@/service/queryClient';
import { localStg } from '@/utils/storage';

/**
 * 处理路由跳转：包含外链跳转逻辑
 *
 * @param to 目标路由
 * @param from 上一个路由
 * @returns 跳转配置 / null
 */
function handleRouteSwitch(to: Router.Route, from: Router.Route | null) {
  // route with href
  // 如果路由配置了外链，新开窗口打开
  if (to.handle.href) {
    window.open(to.handle.href, '_blank');

    return { path: from?.fullPath as string, replace: true };
  }

  return null;
}

/**
 * 路由守卫核心方法：控制页面访问权限、登录状态、角色校验
 *
 * @param to 目标路由
 * @param roles 用户角色数组
 * @param isSuper 是否为超级管理员
 * @param previousRoute 上一个路由
 * @param hasNoMenuPermission 是否无菜单权限
 * @returns 重定向路径 / 跳转配置 / null(放行)
 */
// eslint-disable-next-line max-params
function createRouteGuard(to: Router.Route, roles: string[], isSuper: boolean, previousRoute: Router.Route | null) {
  // 登录页路由
  const loginRoute: RoutePath = '/login';

  // 判断是否已登录（依据本地token）
  const isLogin = Boolean(localStg.get('token'));

  // 404路由标识
  const notFoundRoute = 'notFound';

  // 是否为404路由
  const isNotFoundRoute = to.id === notFoundRoute;

  // ============== 未登录处理 ==============
  if (!isLogin) {
    // 未登录时，常量路由且非404，允许直接访问
    if (to.handle.constant && !isNotFoundRoute) {
      return null;
    }

    // 未登录访问需要权限的页面，重定向到登录页，并携带当前地址作为redirect参数
    const query = to.fullPath;

    const location = `${loginRoute}?redirect=${query}`;

    return location;
  }

  // 已登录状态下的路由常量定义
  const rootRoute: RoutePath = '/';
  const noAuthorizationRoute: RoutePath = '/403';

  // 是否需要登录才能访问（非常量路由）
  const needLogin = !to.handle.constant;
  // 当前路由允许的角色列表
  const routeRoles = to.handle.roles || [];

  // 当前用户是否拥有该路由的角色权限
  const hasRole = roles.some(role => routeRoles.includes(role));

  // 最终权限判定：超级管理员 || 路由无角色限制 || 用户拥有对应角色
  const hasAuth = isSuper || !routeRoles.length || hasRole;

  // 已登录状态访问登录相关页面，自动跳转到首页
  if (to.fullPath.includes('login') && to.pathname !== '/login-out' && isLogin) {
    // 条件说明：
    // 1. to.fullPath.includes('login')：访问路径包含 login（登录相关页面）
    // 2. to.pathname !== '/login-out'：排除退出登录页面（避免退出时被拦截）
    // 3. isLogin：用户已登录
    // 满足以上条件 → 重定向到系统首页
    return rootRoute;
  }

  // 404路由特殊处理
  if (to.id === 'notFound') {
    // 匹配路由表，判断路由是否存在
    const exist = matchRoutes(allRoutes[0].children || [], to.pathname);

    // 路由存在但访问不到 → 无权限，跳转到403
    if (exist && exist.length > 1) {
      return noAuthorizationRoute;
    }

    return null;
  }

  // 不需要登录的路由，直接执行跳转处理（外链）
  if (!needLogin) return handleRouteSwitch(to, previousRoute);

  // if the user is logged in but does not have authorization, then switch to the 403 page
  // 静态路由模式下，无权限访问 → 跳转到403
  if (!hasAuth && import.meta.env.VITE_AUTH_ROUTE_MODE === 'static') return noAuthorizationRoute;

  // 正常放行，执行跳转处理
  return handleRouteSwitch(to, previousRoute);
}

/** 根布局组件：全局路由守卫、页面标题、切换进度条管理 */
const RootLayout = () => {
  // 获取当前路由信息
  const route = useRoute();

  // 获取上一个路由
  const previousRoute = usePrevious(route);

  // 解构当前路由常用属性
  const { handle, id, pathname } = route;

  // 缓存路由ID，避免重复执行守卫逻辑
  const routeId = useRef<string>(null);

  // 缓存路由守卫返回的跳转目标
  const location = useRef<string | { path: string; replace: boolean } | null>(null);

  // 路由标题/国际化配置
  const { i18nKey, title } = handle;

  // 获取用户信息
  const { data: userInfo } = useUserInfo();

  // 用户角色数组
  const roles = userInfo?.roles || [];

  // 是否为超级管理员
  const isSuper = userInfo?.roles.includes(import.meta.env.VITE_STATIC_SUPER_ROLE);

  // 国际化翻译hook
  const { t } = useTranslation();

  // 监听路由标题/国际化，动态修改页面title
  useEffect(() => {
    document.title = i18nKey ? t(i18nKey) : title;
  }, [i18nKey, title, t]);

  // 路由切换时控制页面加载进度条
  useEffect(() => {
    window.NProgress?.done?.();

    return () => {
      window.NProgress?.start?.();
    };
  }, [pathname]);

  // 路由变化时执行一次守卫逻辑
  if (routeId.current !== id) {
    routeId.current = id;

    location.current = createRouteGuard(route, roles, isSuper || false, previousRoute);
  }

  // ============== 渲染结果 ==============
  // 如果守卫返回了跳转目标 → 执行跳转
  // 否则 → 渲染子路由 Outlet
  // eslint-disable-next-line no-nested-ternary
  return location.current ? (
    typeof location.current === 'string' ? (
      <Navigate to={location.current} />
    ) : (
      <Navigate
        replace={location.current.replace}
        to={location.current.path}
      />
    )
  ) : (
    <Outlet context={previousRoute} />
  );
};

/** 路由加载器：进入系统前预先加载用户信息（有 token 时） */
export async function loader() {
  const hasToken = Boolean(localStg.get('token'));

  // 已登录 → 提前请求用户信息缓存
  if (hasToken) {
    await queryClient.prefetchQuery({
      gcTime: Infinity,
      queryFn: fetchGetUserInfo,
      queryKey: QUERY_KEYS.AUTH.USER_INFO,
      staleTime: Infinity
    });
  }
}

export default RootLayout;
