import { useMutation, useQuery } from '@tanstack/react-query';

import {
  fetchGetAllPages,
  fetchGetAllRoles,
  fetchGetMenuList,
  fetchGetMenuTree,
  fetchGetRoleList,
  fetchUserAdd,
  fetchUserList,
  fetchUserUpdate
} from '../api';
import { QUERY_KEYS } from '../keys';

/**
 * 获取角色列表Hook
 *
 * @example
 *   const { data: roleList, isLoading } = useRoleList({ current: 1, size: 10 });
 *
 * @param params - 搜索参数（分页、筛选条件等）
 */
export function useRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return useQuery({
    queryFn: () => fetchGetRoleList(params),
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.ROLE_LIST(params)
  });
}

/**
 * 获取所有角色Hook
 *
 * useQuery 会自动执行一次请求并缓存数据，而 refetch 允许你在需要的时候（比如操作后、用户主动刷新时）手动重新调用这个请求，更新数据。
 *
 * @example
 *   const { data: allRoles, isLoading, refetch } = useAllRoles();
 */
export function useAllRoles() {
  return useQuery({
    queryFn: fetchGetAllRoles, // 实际发请求的函数（调用后端/getAllRoles接口）
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.ALL_ROLES, // 缓存标识（唯一）
    staleTime: 0 // 数据立即变为"过期"，但仍需手动/自动触发刷新
  });
}

/**
 * 获取菜单列表Hook
 *
 * @example
 *   const { data: menuList, isLoading } = useMenuList();
 *
 * @param params - 菜单搜索参数（筛选条件等）
 */
export function useMenuList(params?: Api.SystemManage.SysMenuSearchParams) {
  return useQuery({
    queryFn: () => fetchGetMenuList(params),
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.MENU_LIST(params)
  });
}

/**
 * 获取所有页面Hook
 *
 * @example
 *   const { data: allPages, isLoading } = useAllPages();
 */
export function useAllPages() {
  return useQuery({
    // 执行查询的异步函数，用于获取所有页面数据
    queryFn: fetchGetAllPages,
    // 该查询的唯一标识，用于缓存管理和失效控制
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.ALL_PAGES,
    /**
     * staleTime（数据新鲜时间）设置为 0 含义：数据一旦获取后立即变为"过期(stale)"状态 影响：
     *
     * 1. 每次组件挂载/查询触发时，都会发起新的请求（即使缓存中已有数据）
     * 2. 保证获取到的始终是最新的页面列表数据，避免使用缓存的旧数据
     * 3. 适用于页面列表频繁变更、需要实时性高的场景
     */
    staleTime: 0
  });
}

/**
 * 获取菜单树形结构Hook
 *
 * @example
 *   const { data: menuTree, isLoading } = useMenuTree();
 */
export function useMenuTree() {
  return useQuery({
    queryFn: fetchGetMenuTree,
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.MENU_TREE
  });
}

// 用户相关API请求封装，可根据需要继续添加

/**
 * 获取用户列表Hook
 *
 * @example
 *   const { data: userList, isLoading } = useUserList({ current: 1, size: 10 });
 *
 * @param params - 用户搜索参数（分页、筛选条件等）
 */
export function useUserList(params?: Api.SystemManage.UserSearchParams) {
  return useQuery({
    queryFn: () => fetchUserList(params),
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.USER_LIST(params)
  });
}

/** 新增用户的Mutation Hook */
export const useAddUser = () => {
  return useMutation({
    mutationFn: (userData: Api.SystemManage.SystemUser) => fetchUserAdd(userData)
  });
};

/** 编辑用户的Mutation Hook */
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (userData: Api.SystemManage.SystemUser) => fetchUserUpdate(userData)
  });
};
