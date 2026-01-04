/**
 * 命名空间 Api.SystemManage
 *
 * 后端 API 模块：系统管理模块
 */
declare namespace Api {
  namespace SystemManage {
    /** 通用搜索参数 */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** 角色 */
    interface SysRole {
      /** 创建时间（自动填充，格式：YYYY-MM-DD HH:mm:ss） */
      createTime: string;

      /** 默认首页ID 关联页面/菜单表的主键ID，用于指定该角色登录后默认打开的首页 */
      defaultHomePageId?: number;

      /** 角色编码（唯一标识，如：admin/editor/guest） */
      roleCode: string;

      /** 角色描述 */
      roleDesc: string;

      /** 角色ID（主键） */
      roleId: number;

      /** 角色名称（如：超级管理员/普通编辑/游客） */
      roleName: string;

      /**
       * 角色状态（1:正常 2:禁止，默认1）
       *
       * @example
       *   1;
       */
      status: EnableStatus | null;

      /** 更新时间（自动填充，格式：YYYY-MM-DD HH:mm:ss） */
      updateTime: string;
    }

    /** 角色搜索参数 */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.SysRole, 'roleCode' | 'roleName' | 'status'> & CommonSearchParams
    >;

    /** 角色菜单信息VO */
    type RoleMenuVO = {
      /** 默认首页ID */
      defaultHomePageId?: number;
      /** 菜单Id列表 */
      menuIdList: number[];
      /** 角色ID */
      roleId: number;
    };

    /** 角色列表 */
    type RoleList = Common.PaginatingQueryRecord<SysRole>;

    /** 所有角色（简化版） */
    type RoleSimple = Pick<SysRole, 'roleCode' | 'roleId' | 'roleName'>;

    /** ********************************用户相关************************************* */

    type UserGender = import('../enums').UserGenderValue;

    type EnableStatus = import('../enums').EnableStatusValue;

    /** 用户 */
    interface SystemUser {
      /**
       * 头像URL（可选，需为有效URL）
       *
       * @example
       *   https://example.com/avatar.png
       */
      avatar?: string /**
       * 创建时间（自动填充，无需传值）
       *
       * @example
       *   2025-06-25 10:30:00
       */;
      createTime?: string;
      /**
       * 登录密码（必填，8-32位，包含字母+数字+特殊字符） 【前端注意】仅注册/修改密码时传，查询/列表接口返回时需脱敏为 null/''
       *
       * @example
       *   Admin@123456
       */
      password?: string;

      /** 分配的角色ID列表 */
      roleIds: number[];

      /** 用户关联的角色列表 */
      roleList: RoleSimple[];

      /**
       * 用户状态（1:正常 2:禁止，默认1）
       *
       * @example
       *   1;
       */
      status: EnableStatus | null;

      /**
       * 修改时间（自动填充，无需传值）
       *
       * @example
       *   2025-06-25 11:45:00
       */
      updateTime?: string;

      /**
       * 用户邮箱（可选，格式需合法）
       *
       * @example
       *   admin@example.com
       */
      userEmail?: string;

      /**
       * 用户性别（1:男 2:女，可选）
       *
       * @example
       *   1;
       */
      userGender: UserGender | null;

      /**
       * 系统用户ID（新增/登录无需传，修改/删除必须传正整数）
       *
       * @example
       *   1001;
       */
      userId: number;

      /**
       * 用户名（唯一，必填，4-20位字母/数字/下划线）
       *
       * @example
       *   admin123;
       */
      userName: string;

      /**
       * 用户昵称（必填，2-10位中文/字母/数字）
       *
       * @example
       *   潘总;
       */
      userNick: string;

      /**
       * 手机号（唯一，11位纯数字）
       *
       * @example
       *   13800138000;
       */
      userPhone: string;
    }

    /** 用户搜索参数 */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.SystemUser, 'status' | 'userEmail' | 'userGender' | 'userName' | 'userNick' | 'userPhone'> &
        CommonSearchParams
    >;

    /** 用户列表 */
    type UserList = Common.PaginatingQueryRecord<SystemUser>;

    /**
     * 菜单类型
     *
     * - 1: 目录
     * - 2: 菜单
     */
    type MenuType = import('../enums').MenuTypeValue;

    /** 菜单按钮 */
    type MenuButton = {
      /**
       * 按钮编码
       *
       * 可用于控制按钮权限
       */
      code: string;
      /** 按钮描述 */
      desc: string;
    };

    /**
     * 图标类型
     *
     * - 1: iconify 图标
     * - 2: 本地图标
     */
    type IconType = import('../enums').IconTypeValue;

    /** 菜单的路由属性 */
    type MenuPropsOfRoute = Pick<
      Router.RouteHandle,
      | 'activeMenu'
      | 'constant'
      | 'fixedIndexInTab'
      | 'hideInMenu'
      | 'href'
      | 'i18nKey'
      | 'keepAlive'
      | 'multiTab'
      | 'order'
      | 'query'
    >;

    /** 菜单 */
    interface SysMenu {
      /** 高亮的菜单（指定menu_id，用于非菜单页高亮） */
      activeMenu?: string;
      /** 当前菜单的子菜单列表（树形结构展示用） */
      children?: SysMenu[];
      /** 组件路径 */
      component?: string;
      /** 常量路由：true=是，false=否（对应数据库1/0） */
      constant: boolean;
      /** 创建时间 */
      createdTime?: string;
      /** 固定在页签中的序号（默认999表示不固定，数字越小越靠前） */
      fixedIndexInTab?: number;
      /** 隐藏菜单：true=是，false=否（对应数据库1/0） */
      hideInMenu: boolean;
      /** 外链地址（http/https开头） */
      href?: string;
      /** 国际化key（对应语言包） */
      i18nKey?: string;
      /** 图标标识（如：ep:menu） */
      icon?: string;
      /** 图标类型：1=iconify图标，2=本地图标 */
      iconType: IconType;
      /** 缓存路由：true=是，false=否（对应数据库1/0） */
      keepAlive: boolean;
      /** 布局类型（如：basic、blank） */
      // layout?: string;
      /** 菜单ID（主键） */
      menuId: number;
      /** 菜单名称 */
      menuName: string;
      /** 菜单类型：1=目录，2=菜单 */
      menuType: MenuType;
      /** 支持多页签：true=是，false=否（对应数据库1/0） */
      multiTab?: boolean;
      /** 菜单排序（数字越小越靠前） */
      order?: number;
      /** 父级菜单ID（0表示根菜单） */
      parentId: number;
      /** 路由参数（JSON格式） 示例：[{"key":"age","value":"18"},{"key":"id","value":"1001"}]，仅允许合法JSON字符串 */
      query?: any;
      /** 路由名称（系统菜单） */
      routeName: string;
      /** 路由路径（如：/system/menu） */
      routePath: string;
      /** 菜单状态：1=启用，2=禁用 */
      status: EnableStatus;
      /** 修改时间 */
      updatedTime?: string;
    }

    /** 菜单搜索参数 */
    type SysMenuSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.SysMenu, 'menuName' | 'menuType' | 'parentId' | 'status'> & CommonSearchParams
    >;

    /** 菜单列表 */
    type MenuList = Common.PaginatingQueryRecord<SysMenu>;

    /** 菜单树 */
    type MenuTree = {
      /** 子菜单树 */
      children?: MenuTree[];
      /** 菜单 ID */
      id: number;
      /** 菜单标签 */
      label: string;
      /** 父级菜单 ID */
      pId: number;
    };
  }
}
