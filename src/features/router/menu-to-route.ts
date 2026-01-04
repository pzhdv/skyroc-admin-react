/**
 * 菜单转路由工具函数
 *
 * 将后端菜单数据转换为前端路由配置格式
 */

/**
 * 将菜单列表转换为后端路由格式
 *
 * @param menuList 菜单列表数据
 * @returns 后端路由数组
 */
export function transformMenuListToBackendRoutes(menuList: Api.SystemManage.SysMenu[]): Api.Route.BackendRoute[] {
  // 从 MenuList 中提取菜单数组
  const menus = Array.isArray(menuList) ? menuList : [];

  return menus.map(menu => transformSysMenuToBackendRoute(menu));
}

/** 构建路由 handle 对象 */
function buildRouteHandle(menu: Api.SystemManage.SysMenu): Router.RouteHandle {
  const {
    activeMenu,
    constant,
    hideInMenu,
    href,
    i18nKey,
    icon,
    iconType,
    keepAlive,
    menuName,
    multiTab,
    order,
    query
  } = menu;

  const handle: Router.RouteHandle = {
    activeMenu: activeMenu ? (activeMenu as Router.RouteHandle['activeMenu']) : undefined,
    constant: constant || undefined,
    hideInMenu: hideInMenu || undefined,
    i18nKey: i18nKey ? (i18nKey as Router.RouteHandle['i18nKey']) : undefined,
    keepAlive: keepAlive || undefined,
    multiTab: multiTab ?? undefined,
    order: order ?? undefined,
    query: query || undefined,
    title: menuName
  };

  // icon 处理：根据 iconType 决定使用 icon 还是 localIcon
  if (icon) {
    if (iconType === 1) {
      handle.icon = icon;
    } else if (iconType === 2) {
      handle.localIcon = icon;
    }
  }

  // href 和 url 处理
  if (href) {
    // 如果是 iframe-page 组件，使用 url
    if (menu.component === 'page.iframe-page') {
      handle.url = href.trim();
    } else {
      // 否则使用 href（外链）
      handle.href = href.trim();
    }
  }

  return handle;
}

/**
 * 处理路由重定向
 *
 * 如果路由没有组件（目录类型）且有子路由，自动重定向到第一个子路由
 *
 * @param menu 菜单项
 * @returns 重定向路径，如果不需要重定向则返回 undefined
 */
function getRouteRedirect(menu: Api.SystemManage.SysMenu): string | undefined {
  const { children, component } = menu;

  // 如果路由没有组件（目录类型）且有子路由，重定向到第一个子路由
  if (!component && children && children.length > 0) {
    // 按 order 排序，找到第一个有 routePath 的子路由
    const sortedChildren = [...children].sort((a, b) => (a.order || 0) - (b.order || 0));
    const firstChild = sortedChildren.find(child => child.routePath);
    return firstChild?.routePath;
  }

  return undefined;
}

/** 将单个菜单项转换为后端路由 */
function transformSysMenuToBackendRoute(menu: Api.SystemManage.SysMenu): Api.Route.BackendRoute {
  const { children, component, routeName, routePath } = menu;

  const handle = buildRouteHandle(menu);

  const route: Api.Route.BackendRoute = {
    handle,
    name: routeName || '',
    path: routePath || ''
  };

  // component 处理
  if (component) {
    route.component = component;
  }

  // 递归处理 children
  if (children && children.length > 0) {
    route.children = children.map(child => transformSysMenuToBackendRoute(child));
  }

  // 处理路由重定向：如果路由没有组件且有子路由，自动重定向到第一个子路由
  const redirect = getRouteRedirect(menu);
  if (redirect) {
    route.redirect = redirect;
  }

  return route;
}
