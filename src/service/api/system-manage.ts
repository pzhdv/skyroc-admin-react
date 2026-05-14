import { request } from '../request';

/** ************************ 日志记录相关 API ************************** */

export function fetchOperationLogList(params?: Api.SystemManage.SysOperationLogSearchParams) {
  return request<Api.SystemManage.SysOperationLogList>({
    method: 'get',
    params,
    url: '/sys-operation-log/page'
  });
}

/**
 * 单条删除操作日志
 *
 * @param id 日志ID
 */
export function fetchOpLogDeleteById(id: number) {
  return request<boolean>({
    method: 'delete',
    url: `/sys-operation-log/delete/${id}`
  });
}

/**
 * 批量删除操作日志
 *
 * @param ids 日志ID数组
 */
export function fetchOpLogBatchDelete(ids: number[]) {
  return request<boolean>({
    data: { ids },
    method: 'delete',
    url: '/sys-operation-log/delete/batch'
  });
}

/** ************************ 菜单相关 API ************************** */

/**
 * 获取菜单树形结构
 *
 * @returns 菜单树形列表
 */
export function fetchGetMenuTree() {
  return request<Api.Common.TreeVO[]>({
    method: 'get',
    url: '/systemManage/sysMenu/getMenuTree'
  });
}

/**
 * 获取所有页面菜单
 *
 * @returns 所有菜单页面集合
 */
export function fetchGetAllPages() {
  return request<Api.SystemManage.SysMenu[]>({
    method: 'get',
    url: '/systemManage/sysMenu/getAllPages'
  });
}

/**
 * 获取菜单列表（树形结构）
 *
 * @param params 搜索参数
 * @returns 菜单分页树形列表
 */
export function fetchGetMenuList(params?: Api.SystemManage.SysMenuSearchParams) {
  return request<Api.SystemManage.MenuList>({
    method: 'get',
    params,
    url: '/systemManage/sysMenu/getMenuListTree'
  });
}

/**
 * 新增菜单
 *
 * @param menu 菜单表单数据
 * @returns 操作结果
 */
export function fetchSysMenuAdd(menu: Api.SystemManage.SysMenu) {
  return request<boolean>({
    data: menu,
    method: 'post',
    url: '/systemManage/sysMenu/add'
  });
}

/**
 * 修改菜单
 *
 * @param menu 菜单表单数据
 * @returns 操作结果
 */
export function fetchSysMenuUpdate(menu: Api.SystemManage.SysMenu) {
  return request<boolean>({
    data: menu,
    method: 'put',
    url: '/systemManage/sysMenu/edit'
  });
}

/**
 * 根据菜单ID获取菜单详情
 *
 * @param menuId 菜单ID
 * @returns 菜单详情
 */
export function fetchMenuDetailById(menuId: number) {
  return request<Api.SystemManage.SysMenu>({
    method: 'get',
    params: { menuId },
    url: '/systemManage/sysMenu/getMenuDetailById'
  });
}

/**
 * 根据菜单ID删除菜单
 *
 * @param menuId 菜单ID
 * @returns 操作结果
 */
export function fetchMenuDeleteById(menuId: number) {
  return request<boolean>({
    method: 'delete',
    url: `/systemManage/sysMenu/delete/${menuId}`
  });
}

/** ************************ 权限按钮相关 API ************************** */

/**
 * 分页获取权限按钮列表
 *
 * @param params 搜索参数
 * @returns 权限按钮分页列表
 */
export function fetchGetSysButtonListByConditionPage(params?: Api.SystemManage.SysButtonSearchParams) {
  return request<Api.SystemManage.SysButtonList>({
    method: 'get',
    params,
    url: '/systemManage/SysButton/getSysButtonListByConditionPage'
  });
}

/**
 * 条件查询按钮列表（不分页）
 *
 * @param params 搜索参数
 * @returns 按钮列表
 */
function fetchGetSysButtonList(params?: Omit<Api.SystemManage.SysButtonSearchParams, 'current' | 'size'>) {
  return request<Api.SystemManage.SysButton[]>({
    method: 'get',
    params,
    url: '/systemManage/SysButton/getSysButtonList'
  });
}

/**
 * 条件查询按钮列表（包装成分页格式，适配 useTable）
 *
 * @param params 搜索参数
 * @returns 分页格式数据
 */
export async function fetchGetSysButtonListWrapper(params?: Api.SystemManage.SysButtonSearchParams) {
  const safeParams = params || {};
  const { current, size, ...searchParams } = safeParams;
  const resList = await fetchGetSysButtonList(searchParams);

  return {
    current: 1,
    records: resList || [],
    size: resList?.length || 0,
    total: resList?.length || 0
  };
}

/**
 * 新增权限按钮
 *
 * @param button 按钮表单数据
 * @returns 操作结果
 */
export function fetchSysButtonAdd(button: Api.SystemManage.SysButton) {
  return request<boolean>({
    data: button,
    method: 'post',
    url: '/systemManage/SysButton/add'
  });
}

/**
 * 编辑权限按钮
 *
 * @param button 按钮表单数据
 * @returns 操作结果
 */
export function fetchSysButtonEdit(button: Api.SystemManage.SysButton) {
  return request<boolean>({
    data: button,
    method: 'put',
    url: '/systemManage/SysButton/edit'
  });
}

/**
 * 根据按钮ID删除权限按钮
 *
 * @param buttonId 按钮ID
 * @returns 操作结果
 */
export function fetchSysButtonById(buttonId: number) {
  return request<boolean>({
    method: 'delete',
    url: `/systemManage/SysButton/delete/${buttonId}`
  });
}

/**
 * 批量删除权限按钮
 *
 * @param ids 按钮ID数组
 * @returns 操作结果
 */
export function fetchRoleSysButtonBatchDelete(ids: number[]) {
  return request<boolean>({
    data: { ids },
    method: 'delete',
    url: '/systemManage/SysButton/delete/batch'
  });
}

/**
 * 检查按钮编码是否已存在
 *
 * @param buttonCode 按钮编码
 * @returns true
 */
export function fetchCheckSysButtonCodeExists(buttonCode: string) {
  return request<boolean>({
    method: 'get',
    params: { buttonCode },
    url: '/systemManage/SysButton/checkButtonCodeExists'
  });
}

/** ************************ 角色相关 API ************************** */

/**
 * 获取角色列表
 *
 * @param params 搜索参数
 * @returns 角色分页列表
 */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    method: 'get',
    params,
    url: '/systemManage/role/getRoleList'
  });
}

/**
 * 获取所有启用的角色
 *
 * @returns 角色简易列表
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.RoleSimple[]>({
    method: 'get',
    url: '/systemManage/role/getAllRoles'
  });
}

/**
 * 检查角色编码是否已存在
 *
 * @param roleCode 角色编码
 * @returns true
 */
export function fetchCheckRoleCodeExists(roleCode: string) {
  return request<boolean>({
    method: 'get',
    params: { roleCode },
    url: '/systemManage/role/checkRoleCodeExists'
  });
}

/**
 * 新增角色
 *
 * @param role 角色表单数据
 * @returns 操作结果
 */
export function fetchRoleAdd(role: Api.SystemManage.SysRole) {
  return request<boolean>({
    data: role,
    method: 'post',
    url: '/systemManage/role/add'
  });
}

/**
 * 编辑角色
 *
 * @param role 角色表单数据
 * @returns 操作结果
 */
export function fetchRoleEdit(role: Api.SystemManage.SysRole) {
  return request<boolean>({
    data: role,
    method: 'put',
    url: '/systemManage/role/edit'
  });
}

/**
 * 根据角色ID删除角色
 *
 * @param roleId 角色ID
 * @returns 操作结果
 */
export function fetchRoleDeleteById(roleId: number) {
  return request<boolean>({
    method: 'delete',
    url: `/systemManage/role/delete/${roleId}`
  });
}

/**
 * 批量删除角色
 *
 * @param ids 角色ID数组
 * @returns 操作结果
 */
export function fetchRoleBatchDelete(ids: number[]) {
  return request<boolean>({
    data: { ids },
    method: 'delete',
    url: '/systemManage/role/delete/batch'
  });
}

/** ************************ 角色菜单权限 API ************************** */

/**
 * 更新角色菜单权限
 *
 * @param roleMenu 角色菜单权限数据
 * @returns 操作结果
 */
export function fetchUpdateRoleMenuAuth(roleMenu: Api.SystemManage.RoleMenuVO) {
  return request<boolean>({
    data: roleMenu,
    method: 'put',
    url: '/sys-role-menu/updateRoleMenuAuth'
  });
}

/**
 * 根据角色ID获取菜单ID与首页配置
 *
 * @param roleId 角色ID
 * @returns 菜单权限与首页信息
 */
export function fetchGetMenuIdsAndHomeByRoleId(roleId: number) {
  return request<Api.SystemManage.RoleMenuVO>({
    method: 'get',
    url: `/sys-role-menu/getMenuIdsAndHomeByRoleId/${roleId}`
  });
}

/** ************************ 角色按钮权限 API ************************** */

/**
 * 根据角色ID获取按钮权限
 *
 * @param roleId 角色ID
 * @returns 按钮权限数据
 */
export function fetchGetButtonsByRoleId(roleId: number) {
  return request<Api.SystemManage.RoleButtonVO>({
    method: 'get',
    url: `/sys-role-button/getButtonIdsByRoleId/${roleId}`
  });
}

/**
 * 更新角色按钮权限
 *
 * @param roleButton 角色按钮权限数据
 * @returns 操作结果
 */
export function fetchUpdateRoleButtonAuth(roleButton: Api.SystemManage.RoleButtonVO) {
  return request<boolean>({
    data: roleButton,
    method: 'put',
    url: '/sys-role-button/updateRoleButtonAuth'
  });
}

/** ************************ 用户相关 API ************************** */

/**
 * 获取用户列表
 *
 * @param params 搜索参数
 * @returns 用户分页列表
 */
export function fetchUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    method: 'get',
    params,
    url: '/systemManage/systemUser/getUserList'
  });
}

/**
 * 新增用户
 *
 * @param user 用户表单数据
 * @returns 操作结果
 */
export function fetchUserAdd(user: Api.SystemManage.SystemUser) {
  return request<boolean>({
    data: user,
    method: 'post',
    url: '/systemManage/systemUser/register'
  });
}

/**
 * 更新用户信息
 *
 * @param user 用户表单数据
 * @returns 操作结果
 */
export function fetchUserUpdate(user: Api.SystemManage.SystemUser) {
  return request<boolean>({
    data: user,
    method: 'put',
    url: '/systemManage/systemUser/update'
  });
}

/**
 * 根据用户ID获取用户详情
 *
 * @param userId 用户ID
 * @returns 用户详情
 */
export function fetchUserDetailById(userId: number) {
  return request<Api.SystemManage.SystemUser>({
    method: 'get',
    params: { userId },
    url: '/systemManage/systemUser/getUserInfoById'
  });
}

/**
 * 根据用户ID删除用户
 *
 * @param userId 用户ID
 * @returns 操作结果
 */
export function fetchUserDeleteById(userId: number) {
  return request<boolean>({
    method: 'delete',
    url: `/systemManage/systemUser/delete/${userId}`
  });
}

/**
 * 批量删除用户
 *
 * @param ids 用户ID数组
 * @returns 操作结果
 */
export function fetchUserBatchDelete(ids: number[]) {
  return request<boolean>({
    data: { ids },
    method: 'delete',
    url: '/systemManage/systemUser/delete/batch'
  });
}

/**
 * 检查用户名是否已存在
 *
 * @param userName 用户名
 * @returns true
 */
export function fetchCheckUserNameExist(userName: string) {
  return request<boolean>({
    method: 'get',
    params: { userName },
    url: '/systemManage/systemUser/checkUserNameExists'
  });
}

/**
 * 检查用户邮箱是否已存在
 *
 * @param userEmail 邮箱
 * @returns true
 */
export function fetchCheckUserEmailExist(userEmail: string) {
  return request<boolean>({
    method: 'get',
    params: { userEmail },
    url: '/systemManage/systemUser/checkUserEmailExists'
  });
}

/**
 * 检查用户手机号是否已存在
 *
 * @param userPhone 手机号
 * @returns true
 */
export function fetchCheckUserPhoneExist(userPhone: string) {
  return request<boolean>({
    method: 'get',
    params: { userPhone },
    url: '/systemManage/systemUser/checkUserPhoneIsExist'
  });
}
