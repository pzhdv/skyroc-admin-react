import { request } from '../request';

/** ************************* 菜单相关 API ************************** */

/** 获取菜单树形结构 */
export function fetchGetMenuTree() {
  return request<Api.Common.TreeVO[]>({
    method: 'get',
    url: '/systemManage/sysMenu/getMenuTree'
  });
}

/** 获取所有页面菜单 */
export function fetchGetAllPages() {
  return request<Api.SystemManage.SysMenu[]>({
    method: 'get',
    url: '/systemManage/sysMenu/getAllPages'
  });
}

/**
 * 获取菜单列表
 *
 * 根据搜索条件查询系统菜单列表，支持分页、筛选等功能
 *
 * @param {Api.SystemManage.SysMenuSearchParams} [params] - 可选的菜单搜索参数（如菜单名称、状态等）
 * @returns {Promise<Api.SystemManage.MenuList>} 返回菜单列表数据（包含列表项和分页信息）
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
 * 创建新的系统菜单，需传入完整的菜单信息
 *
 * @param {Api.SystemManage.SysMenu} menu - 新菜单的完整信息对象
 * @returns {Promise<boolean>} 返回操作结果，true 表示新增成功
 */
export function fetchSysMenuAdd(menu: Api.SystemManage.SysMenu) {
  return request<boolean>({
    data: menu,
    method: 'post',
    url: '/systemManage/sysMenu/add'
  });
}

/**
 * 更新菜单
 *
 * 更新系统菜单，需传入完整的菜单信息
 *
 * @param {Api.SystemManage.SysMenu} menu - 新菜单的完整信息对象
 * @returns {Promise<boolean>} 返回操作结果，true 表示更新成功
 */
export function fetchSysMenuUpdate(menu: Api.SystemManage.SysMenu) {
  return request<boolean>({
    data: menu,
    method: 'put',
    url: '/systemManage/sysMenu/edit'
  });
}

/**
 * 根据菜单 ID 获取菜单详情
 *
 * 通过菜单 ID 查询单个菜单的完整信息，主要用于编辑页面表单回填
 *
 * @param {number} menuId - 菜单的唯一标识 ID
 * @returns {Promise<Api.SystemManage.SysMenu>} 返回菜单详细信息对象
 */
export function fetchMenuDetailById(menuId: number) {
  return request<Api.SystemManage.SysMenu>({
    method: 'get',
    params: { menuId },
    url: '/systemManage/sysMenu/getMenuDetailById'
  });
}

/**
 * 根据菜单 ID 删除单个菜单
 *
 * 删除指定的系统菜单，此操作不可逆，删除前请确认菜单数据无需保留
 *
 * @param {number} menuId - 菜单的唯一标识 ID
 * @returns {Promise<boolean>} 返回操作结果，true 表示删除成功
 */
export function fetchMenuDeleteById(menuId: number) {
  return request<boolean>({
    method: 'delete',
    url: `/systemManage/sysMenu/delete/${menuId}`
  });
}

/** ************************* 用户相关 API ************************** */

/**
 * 获取用户列表
 *
 * 根据搜索条件查询系统用户列表，支持分页、筛选等功能
 *
 * @param {Api.SystemManage.UserSearchParams} [params] - 可选的用户搜索参数（如用户名、角色、状态等）
 * @returns {Promise<Api.SystemManage.UserList>} 返回用户列表数据（包含列表项和分页信息）
 */
export function fetchUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    method: 'get',
    params,
    url: '/systemManage/systemUser/getUserList'
  });
}

/**
 * 新增用户（注册）
 *
 * 创建新的系统用户，需传入完整的用户信息（除自动生成的字段外）
 *
 * @param {Api.SystemManage.SystemUser} user - 新用户的完整信息对象
 * @returns {Promise<boolean>} 返回操作结果，true 表示新增成功
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
 * 编辑已存在的用户信息，必须传入 userId 以指定待更新的用户
 *
 * @param {Api.SystemManage.SystemUser} user - 系统用户对象（必须包含 userId 字段）
 * @returns {Promise<boolean>} 返回操作结果，true 表示更新成功
 */
export function fetchUserUpdate(user: Api.SystemManage.SystemUser) {
  return request<boolean>({
    data: user,
    method: 'put',
    url: '/systemManage/systemUser/update'
  });
}

/**
 * 根据用户 ID 获取用户详情
 *
 * 通过用户 ID 查询单个用户的完整信息，主要用于编辑页面表单回填
 *
 * @param {number} userId - 目标用户的唯一标识 ID
 * @returns {Promise<Api.SystemManage.SystemUser>} 返回用户详细信息对象
 */
export function fetchUserDetailById(userId: number) {
  return request<Api.SystemManage.SystemUser>({
    method: 'get',
    params: { userId },
    url: '/systemManage/systemUser/getUserInfoById'
  });
}

/**
 * 根据用户 ID 删除单个用户
 *
 * 删除指定的系统用户，此操作不可逆，删除前请确认用户数据无需保留
 *
 * @param {number} userId - 待删除用户的唯一标识 ID
 * @returns {Promise<boolean>} 返回操作结果，true 表示删除成功
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
 * 批量删除指定的多个系统用户，此操作不可逆，删除前请确认所有待删除用户数据无需保留
 *
 * @param {number[]} ids - 待删除用户的 ID 列表
 * @returns {Promise<boolean>} 返回操作结果，true 表示批量删除成功
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
 * 用于注册新用户或编辑用户信息时，验证用户名的唯一性，防止重复注册
 *
 * @param {string} userName - 待检查的用户名
 * @returns {Promise<boolean>} true 表示用户名已存在，false 表示用户名可用
 */
export function fetchCheckUserNameExist(userName: string) {
  return request<boolean>({
    method: 'get',
    params: { userName },
    url: '/systemManage/systemUser/checkUserNameExist'
  });
}

/**
 * 检查用户邮箱是否已存在
 *
 * 用于注册新用户或编辑用户信息时，验证邮箱的唯一性，防止重复绑定
 *
 * @param {string} userEmail - 待检查的用户邮箱
 * @returns {Promise<boolean>} true 表示邮箱已存在，false 表示邮箱可用
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
 * 用于注册新用户或编辑用户信息时，验证手机号的唯一性，防止重复绑定
 *
 * @param {string} userPhone - 待检查的用户手机号
 * @returns {Promise<boolean>} true 表示手机号已存在，false 表示手机号可用
 */
export function fetchCheckUserPhoneExist(userPhone: string) {
  return request<boolean>({
    method: 'get',
    params: { userPhone },
    url: '/systemManage/systemUser/checkUserPhoneIsExist'
  });
}

/** ************************* 角色相关 API ************************** */

/**
 * 更新角色菜单权限
 *
 * @param roleMenu 角色菜单信息对象
 */
export function fetchUpdateRoleMenuAuth(roleMenu: Api.SystemManage.RoleMenuVO) {
  return request<boolean>({
    data: roleMenu,
    method: 'put',
    url: '/systemManage/role/updateRoleMenuAuth'
  });
}

/**
 * 根根据角色ID获取菜单列表及首页菜单ID
 *
 * @param {number} [roleId] - 角色ID
 */
export function fetchGetMenuIdsAndHomeByRoleId(roleId: number) {
  return request<Api.SystemManage.RoleMenuVO>({
    method: 'get',
    url: `/systemManage/role/getMenuIdsAndHomeByRoleId/${roleId}`
  });
}

/**
 * 获取角色列表
 *
 * 根据搜索条件查询系统角色列表，支持分页、筛选等功能
 *
 * @param {Api.SystemManage.RoleSearchParams} [params] - 可选的角色搜索参数（如角色名称、状态等）
 */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    method: 'get',
    params,
    url: '/systemManage/role/getRoleList'
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
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
 * 用于新增或编辑角色信息时，校验角色编码的唯一性（避免重复）
 *
 * @param {string} roleCode - 待检查的角色编码
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
 * 创建新的系统角色，需传入完整的角色信息（除自动生成的字段外）
 *
 * @param {Api.SystemManage.SysRole} role - 新用户的完整信息对象
 */
export function fetchRoleAdd(role: Api.SystemManage.SysRole) {
  return request<boolean>({
    data: role,
    method: 'post',
    url: '/systemManage/role/add'
  });
}

/**
 * 新增角色
 *
 * 创建新的系统角色，需传入完整的角色信息（除自动生成的字段外）
 *
 * @param {Api.SystemManage.SysRole} role - 新用户的完整信息对象
 */
export function fetchRoleEdit(role: Api.SystemManage.SysRole) {
  return request<boolean>({
    data: role,
    method: 'put',
    url: '/systemManage/role/edit'
  });
}

/**
 * 根据角色 ID 删除单个角色
 *
 * 删除指定的系统角色，此操作不可逆，删除前请确认角色数据无需保留； 注意：删除角色会同步解除该角色关联的用户-角色绑定关系
 *
 * @param {number} roleId - 待删除角色的唯一标识 ID
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
 * 批量删除指定的多个系统角色，此操作不可逆，删除前请确认所有待删除角色数据无需保留； 注意：删除角色会同步解除该角色关联的用户-角色绑定关系
 *
 * @param {number[]} ids - 待删除角色的 ID 列表
 */
export function fetchRoleBatchDelete(ids: number[]) {
  return request<boolean>({
    data: { ids },
    method: 'delete',
    url: '/systemManage/role/delete/batch'
  });
}
