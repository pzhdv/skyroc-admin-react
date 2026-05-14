/*
 * React Query 缓存键集合
 * 全局唯一的 Query / Mutation Key，用于 React Query 缓存管理
 * 规则：按业务模块分层，保证唯一性，方便缓存更新、失效、调试
 */

export const QUERY_KEYS = {
  // 认证模块（登录、用户信息、token）
  AUTH: {
    USER_INFO: ['auth', 'userInfo'] as const // 用户信息缓存
  },

  // 路由模块（静态路由、用户路由）
  ROUTE: {
    CONSTANT_ROUTES: ['route', 'constantRoutes'] as const, // 固定静态路由
    IS_ROUTE_EXIST: (routeName: string) => ['route', 'isRouteExist', routeName] as const, // 路由是否存在
    USER_ROUTES: ['route', 'userRoutes'] as const // 用户动态路由/菜单
  },

  // 系统管理模块（用户、角色、菜单）
  SYSTEM_MANAGE: {
    ALL_PAGES: ['systemManage', 'allPages'] as const, // 所有页面集合
    ALL_ROLES: ['systemManage', 'allRoles'] as const, // 所有角色集合
    MENU_LIST: (params?: Api.SystemManage.SysMenuSearchParams) => ['systemManage', 'menuList', params] as const, // 菜单列表（带参数）
    MENU_TREE: ['systemManage', 'menuTree'] as const, // 菜单树
    ROLE_LIST: (params?: Api.SystemManage.RoleSearchParams) => ['systemManage', 'roleList', params] as const, // 角色列表（带参数）
    USER_LIST: (params?: Api.SystemManage.UserSearchParams) => ['systemManage', 'userList', params] as const // 用户列表（带参数）
  }
} as const;

export const MUTATION_KEYS = {
  // 认证相关操作（非查询类）
  AUTH: {
    LOGIN: ['auth', 'login'] as const, // 登录
    REFRESH_TOKEN: ['auth', 'refreshToken'] as const // 刷新 token
  }
} as const;
