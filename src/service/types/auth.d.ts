/**
 * 命名空间 Api.Auth
 *
 * 后端 API 模块：认证模块
 */
declare namespace Api {
  namespace Auth {
    /** 登录请求参数 */
    type LoginParams = {
      /** 登录密码 */
      password: string;
      /** 用户名 */
      userName: string;
    };

    /** 登录令牌 */
    interface LoginToken {
      /** 访问令牌 */
      accessToken: string;
      /** 刷新令牌 */
      refreshToken: string;
    }

    /** 登录响应数据 */
    type LoginResponse = LoginToken;

    // 登录用户信息
    interface LoginUserInfo {
      /** 用户头像URL（可选） */
      avatar?: string;
      /** 按钮权限列表（格式：模块:操作，如user:add） */
      buttons: string[];
      /** 用户是否有路由权限 */
      hasRoutePermission: boolean;
      /** 默认首页路径 如：/home */
      homePath: string;
      /** 用户角色列表（标识以R_开头，如R_SUPER/R_ADMIN） */
      roles: string[];
      /** 登录用户ID */
      userId: number;
      /** 用户名 */
      userName: string;
      /** 用户昵称 */
      userNick: string;
    }

    /** 系统菜单路由视图对象 */
    interface SystemMenuRoute {
      home: string;
      routes: Api.SystemManage.SysMenu[];
    }
  }
}
