/**
 * 命名空间 Api.Common
 *
 * 通用类型和工具类型
 */
declare namespace Api {
  namespace Common {
    /** 分页通用参数 */
    interface PaginatingCommonParams {
      /** 当前页码 */
      current: number;
      /** 每页条数 */
      size: number;
      /** 总条数 */
      total: number;
    }

    /** 分页查询列表数据的通用参数 */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      /** 数据列表 */
      records: T[];
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * 启用状态
     *
     * - "1": 启用
     * - "2": 禁用
     */
    type EnableStatus = import('../enums').EnableStatusValue;

    /** 通用记录类型 */
    type CommonRecord<T = any> = {
      /** 创建人 */
      createBy: string;
      /** 创建时间 */
      createTime: string;
      /** 记录 ID */
      id: number;
      /** 记录状态 */
      status: EnableStatus | null;
      /** 更新人 */
      updateBy: string;
      /** 更新时间 */
      updateTime: string;
    } & T;

    /** 通用树形结构接口 适配前端树形组件（ElementUI/AntD Tree）默认数据格式 */
    type TreeVO = {
      /** 子节点列表 当前节点的下级树形节点集合；叶子节点（无下级）时返回空列表，不可为null */
      children: TreeVO[];

      /** 国际化key（多语言标识） 对应前端语言包中的key值，用于实现多语言展示；无国际化需求时可返回null/空字符串 */
      i18nKey?: string;

      /** 树节点显示名称 前端树形组件展示的节点文本（如菜单名称、部门名称、权限名称等），非空 */
      label: string;

      /** 树节点唯一标识ID 对应业务场景中的主键（如菜单ID、部门ID、权限ID等），非空且唯一 */
      value: number;
    };
  }
}
