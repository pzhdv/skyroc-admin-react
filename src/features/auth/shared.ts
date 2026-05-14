import { localStg } from '@/utils/storage';

// 获取 token
export function getToken() {
  return localStg.get('token') || '';
}

// 获取用户信息
export function getUserInfo() {
  const emptyInfo: Api.Auth.LoginUserInfo = {
    /** 用户头像URL（可选）- 空字符串适配未设置头像场景，前端可渲染占位图 */
    avatar: '',
    /** 按钮权限列表 - 空数组避免遍历空指针，符合接口非空数组约束 */
    buttons: [],
    /** 是否有路由权限 */
    hasRoutePermission: false,
    /** 默认首页路径 如：/home */
    homePath: import.meta.env.VITE_ROUTE_HOME,
    /** 用户角色列表 - 空数组表示无角色权限，前端可据此隐藏权限相关功能 */
    roles: [],
    /** 登录用户ID - 初始化为0（数字类型默认值），区分未登录/无ID状态 */
    userId: 0,
    /** 用户名 - 空字符串初始化，登录后赋值 */
    userName: '',
    /** 用户昵称 - 空字符串初始化，前端未登录时可展示「未登录」占位文案 */
    userNick: ''
  };

  const userInfo = localStg.get('userInfo') || emptyInfo;

  return userInfo;
}

/** Clear auth storage */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
}
