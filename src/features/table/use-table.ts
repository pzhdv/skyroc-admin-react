import { useBoolean, useHookTable } from '@sa/hooks';
import type { TablePaginationConfig, TableProps } from 'antd';
import { Form } from 'antd';

import { parseQuery } from '@/features/router/query';
import { getIsMobile } from '@/layouts/appStore';

// ==================== 类型定义 ====================
/**
 * 从 API 函数类型中提取返回的数据类型
 *
 * @template A - API 函数类型
 */
type GetTableData<A extends AntDesign.TableApiFn> = AntDesign.GetTableData<A>;
/**
 * 表格列配置类型
 *
 * @template T - 数据行类型
 */
type TableColumn<T> = AntDesign.TableColumn<T>;
/**
 * useTable Hook 的配置类型
 *
 * @template A - API 函数类型
 */
type Config<A extends AntDesign.TableApiFn> = AntDesign.AntDesignTableConfig<A>;

type CustomTableProps<A extends AntDesign.TableApiFn> = Omit<
  TableProps<AntDesign.TableDataWithIndex<GetTableData<A>>>,
  'loading'
> & {
  loading: boolean;
};

// ==================== useTable Hook ====================
export function useTable<A extends AntDesign.TableApiFn>(config: Config<A>) {
  const isMobile = useAppSelector(getIsMobile);

  const {
    apiFn,
    apiParams,
    columns: columnsFactory,
    immediate,
    isChangeURL = true,
    onChange: onChangeCallback,
    pagination: paginationConfig,
    rowKey = 'id',
    transformParams,
    ...rest
  } = config;

  const [form] = Form.useForm<AntDesign.AntDesignTableConfig<A>['apiParams']>();

  const { search } = useLocation();

  const query = parseQuery(search) as unknown as Parameters<A>[0];

  const {
    columnChecks,
    columns,
    data,
    empty,
    loading,
    pageNum,
    pageSize,
    resetSearchParams,
    searchParams,
    setColumnChecks,
    total,
    updateSearchParams
  } = useHookTable<A, GetTableData<A>, TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>>({
    apiFn,
    apiParams: { ...apiParams, ...query },
    columns: columnsFactory,
    getColumnChecks: cols => {
      const checks: AntDesign.TableColumnCheck[] = [];

      cols.forEach(column => {
        if (column.key) {
          checks.push({
            checked: true,
            key: column.key as string,
            title: column.title as string
          });
        }
      });

      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>>();

      cols.forEach(column => {
        if (column.key) {
          columnMap.set(column.key as string, column);
        }
      });

      const filteredColumns = checks.filter(item => item.checked).map(check => columnMap.get(check.key));

      return filteredColumns as TableColumn<AntDesign.TableDataWithIndex<GetTableData<A>>>[];
    },
    immediate,
    isChangeURL,
    transformer: res => {
      const { current = 1, records = [], size = 10, total: totalNum = 0 } = res || {};

      const recordsWithIndex = records.map((item, index) => {
        return {
          ...item,
          index: (current - 1) * size + index + 1
        };
      });

      return {
        data: recordsWithIndex,
        pageNum: current,
        pageSize: size,
        total: totalNum
      };
    },
    transformParams
  });

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const pagination: TablePaginationConfig = {
    current: pageNum,
    pageSize,
    pageSizeOptions: ['10', '20', '50', '100', '200', '500'],
    showSizeChanger: true,
    simple: isMobile,
    total,
    ...paginationConfig
  };
  function reset() {
    form.setFieldsValue(apiParams as NonNullable<Parameters<A>[0]>);

    resetSearchParams();
  }

  async function run(isResetCurrent: boolean = true) {
    const res = await form.validateFields();

    if (res) {
      if (isResetCurrent) {
        const { current = 1, ...other } = res;
        updateSearchParams({ current, ...other });
      } else {
        updateSearchParams(res);
      }
    }
  }

  function handleChange(...args: AntDesign.TableOnChange) {
    const [paginationContext, ...otherParams] = args;

    let other: Parameters<A>[0] = {
      current: paginationContext.current,
      size: paginationContext.pageSize
    } as Parameters<A>[0];

    if (onChangeCallback) {
      const params = onChangeCallback(paginationContext, ...otherParams);
      if (params) {
        other = params;
      }
    }

    updateSearchParams(other);
  }

  return {
    columnChecks,
    data,
    empty,
    form,
    run,
    searchParams,
    searchProps: {
      form,
      reset,
      search: run,
      searchParams: searchParams as NonNullable<Parameters<A>[0]>
    },
    setColumnChecks,
    tableProps: {
      columns,
      dataSource: data,
      loading,
      onChange: handleChange,
      pagination,
      rowKey,
      ...rest
    } as CustomTableProps<A>
  };
}

// ==================== useTableOperate Hook ====================

/**
 * 表格操作配置类型
 *
 * @template T - 表格数据类型（行数据的类型）
 * @template K - 行唯一标识键名类型（如 'id' | 'userId' | 'articleId'）
 * @template ID - 行唯一标识键名对应的值类型（如 number | string，默认推导为 T[K]）
 */
export interface UseTableOperateConfig<T extends Record<string, any>, K extends keyof T, ID = T[K]> {
  /**
   * 表格数据数组
   *
   * 用于编辑时根据 ID 查找对应的行数据
   */
  data: T[];

  /**
   * 执行新增/编辑操作的回调函数
   *
   * 当用户提交表单时调用此函数 通常在这里调用 API 接口保存数据
   *
   * @example
   *   ```tsx
   *   executeResActions: async (res, type) => {
   *     if (type === 'add') {
   *       await createUser(res);
   *     } else {
   *       await updateUser(res);
   *     }
   *   }
   *   ```;
   *
   * @param res - 表单数据
   * @param operateType - 操作类型（'add' 新增 | 'edit' 编辑）
   */
  executeResActions: (res: T, operateType: AntDesign.TableOperateType) => Promise<boolean>;

  /**
   * 获取数据的函数
   *
   * 通常就是 useTable 返回的 run 函数 在新增/编辑/删除后调用此函数刷新表格数据
   *
   * @param isResetCurrent - 是否重置到第一页
   */
  getData: (isResetCurrent?: boolean) => Promise<void>;

  /**
   * 【可选】行唯一标识键名对应的值类型（显式指定，优先级高于自动推导）
   *
   * 用于明确约束 rowKey 的值类型，适用于自动推导不准确的场景
   *
   * @example
   *   ```tsx
   *   // 强制指定 userId 的值类型为 number
   *   idType: Number as typeof Number
   *   ```;
   */
  idType?: ID;
  /**
   * 行数据的唯一标识键名
   *
   * 用于标识表格中每一行数据的唯一字段 如 'id', 'userId', 'articleId' 等
   *
   * @example
   *   ```tsx
   *   rowKey: 'articleId'  // 文章列表
   *   rowKey: 'userId'     // 用户列表
   *   ```;
   */
  rowKey: K;
}

/**
 * 表格操作 Hook
 *
 * 提供表格行数据的增删改操作功能，包括：
 *
 * **核心功能：**
 *
 * - 新增/编辑抽屉管理：控制抽屉的打开/关闭
 * - 表单状态管理：表单实例、表单数据
 * - 行选择（批量操作）：多选框、选中行管理
 * - 删除后的刷新处理：删除成功后刷新数据
 *
 * @example
 *   ```tsx
 *   const {
 *     generalPopupOperation,
 *     handleAdd,
 *     handleEdit,
 *     onDeleted,
 *     rowSelection
 *   } = useTableOperate({
 *     data,
 *     getData: run,
 *     rowKey: 'articleId',
 *     executeResActions: async (res, type) => {
 *       if (type === 'add') {
 *         await createArticle(res);
 *       } else {
 *         await updateArticle(res);
 *       }
 *     }
 *   });
 *
 *   // 在组件中使用
 *   <Table rowSelection={rowSelection} />
 *   <Button onClick={handleAdd}>新增</Button>
 *   <ArticleDrawer {...generalPopupOperation} />
 *   ```;
 *
 * @template T - 表格数据类型
 * @template K - 行键名类型（如 'userId' | 'articleId'）
 * @template ID - 行键名对应的值类型（默认推导为 T[K]，支持显式指定）
 * @param config - 表格操作配置
 * @param config.data - 表格数据数组
 * @param config.executeResActions - 执行新增/编辑操作的回调
 * @param config.getData - 获取数据的函数
 * @param config.rowKey - 行唯一标识键名
 * @param config.idType - 【可选】行键值类型（显式指定，优先级高于自动推导）
 * @returns 返回对象包含：
 * @returns checkedRowKeys - 选中的行键数组（类型为 ID[]）
 * @returns closeDrawer - 关闭抽屉函数
 * @returns drawerVisible - 抽屉显示状态
 * @returns editingData - 正在编辑的行数据
 * @returns generalPopupOperation - 通用弹窗操作属性（传给抽屉组件）
 * @returns handleAdd - 处理新增操作
 * @returns handleEdit - 处理编辑操作（入参为 ID | T）
 * @returns onBatchDeleted - 批量删除后的处理
 * @returns onDeleted - 单条删除后的处理
 * @returns onSelectChange - 行选择变化回调（入参为 ID[]）
 * @returns openDrawer - 打开抽屉函数
 * @returns operateType - 操作类型（'add' | 'edit'）
 * @returns rowSelection - 行选择配置（传给 Table 组件）
 */
export function useTableOperate<
  T extends Record<string, any>,
  K extends keyof T,
  ID = T[K] // 从 rowKey 自动推导 ID 类型，兼容显式指定
>(config: UseTableOperateConfig<T, K, ID>) {
  // 解构配置参数
  const { data, executeResActions, getData, rowKey } = config;

  /**
   * 抽屉显示/隐藏状态
   *
   * 使用 useBoolean Hook 管理抽屉的打开/关闭状态
   */
  const { bool: drawerVisible, setFalse: closeDrawer, setTrue: openDrawer } = useBoolean();

  // 国际化函数
  const { t } = useTranslation();

  /**
   * 操作类型：新增或编辑
   *
   * - 'add'：新增模式，提交时调用新增接口
   * - 'edit'：编辑模式，提交时调用编辑接口
   */
  const [operateType, setOperateType] = useState<AntDesign.TableOperateType>('add');

  /**
   * 表单实例
   *
   * 用于新增/编辑抽屉中的表单
   */
  const [form] = Form.useForm<T>();

  /**
   * 处理新增操作
   *
   * 设置操作类型为新增，打开抽屉 表单会显示空表单
   *
   * @example
   *   ```tsx
   *   <Button onClick={handleAdd}>新增</Button>
   *   ```;
   */
  function handleAdd() {
    setOperateType('add');
    form.resetFields(); // 主动清空（最保险！）
    openDrawer();
  }

  /**
   * 正在编辑的行数据
   *
   * 保存当前正在编辑的数据，用于：
   *
   * - 在编辑模式下显示原始数据
   * - 对比修改前后的变化
   */
  const [editingData, setEditingData] = useState<T>();

  /**
   * 处理编辑操作
   *
   * 根据传入的参数填充表单并打开编辑抽屉 支持两种传参方式：
   *
   * 1. 传入行键值（如 articleId）：从 data 中查找对应数据
   * 2. 传入完整数据对象：直接使用该对象
   *
   * @example
   *   ```tsx
   *   // 方式1：传入 ID（类型为 ID，如 number/string）
   *   <Button onClick={() => handleEdit(123)}>编辑</Button>
   *
   *   // 方式2：传入完整数据对象
   *   <Button onClick={() => handleEdit(record)}>编辑</Button>
   *   ```;
   *
   * @param idOrData - 行键值（ID 类型）或行数据对象（T 类型）
   */
  function handleEdit(idOrData: ID | T) {
    // 类型守卫：判断是否为完整行数据对象
    const isFullData = (value: ID | T): value is T => {
      return typeof value === 'object' && value !== null && rowKey in value;
    };

    let targetData: T | undefined;
    if (isFullData(idOrData)) {
      // 场景1：传入完整行数据对象
      targetData = idOrData;
    } else {
      // 场景2：传入 ID，从 data 中查找对应行数据
      targetData = data.find(item => item[rowKey] === idOrData);
    }

    // 仅当找到有效行数据时才更新表单和 editingData
    if (targetData) {
      form.setFieldsValue(targetData);
      setEditingData(targetData); // ✅ 此时 targetData 是 T 类型，无报错
      setOperateType('edit');
      openDrawer();
    }
  }

  /**
   * 表格选中的行键数组
   *
   * 用于批量操作（如批量删除） 存储用户选中的行的唯一标识，类型为 ID[]
   */
  const [checkedRowKeys, setCheckedRowKeys] = useState<ID[]>([]);

  /**
   * 行选择变化回调
   *
   * 当用户勾选/取消勾选复选框时触发 更新选中的行键数组
   *
   * @param keys - 选中的行键数组（类型为 ID[]）
   */
  function onSelectChange(keys: ID[]) {
    setCheckedRowKeys(keys);
  }

  /**
   * 行选择配置
   *
   * 配置表格的多选功能 这个对象会传给 Table 组件的 rowSelection 属性 内部自动兼容 antd 的 React.Key 类型，外部暴露强类型 ID[]
   *
   * @example
   *   ```tsx
   *   <Table rowSelection={rowSelection} />
   *   ```;
   */
  const rowSelection: TableProps<T>['rowSelection'] = {
    columnWidth: 48, // 选择列的宽度
    fixed: true, // 固定在表格左侧
    onChange: keys => onSelectChange(keys as ID[]), // 兼容 antd 原生类型，转换为强类型 ID[]
    selectedRowKeys: checkedRowKeys as React.Key[], // 转换为 antd 所需的 React.Key[] 类型
    type: 'checkbox' // 多选模式
  };

  /**
   * 关闭抽屉并重置表单
   *
   * 关闭新增/编辑抽屉，并清空表单数据 防止下次打开抽屉时显示上次的数据
   */
  function onClose() {
    closeDrawer();
    form.resetFields();
  }

  /**
   * 批量删除后的处理
   *
   * 在批量删除成功后调用此函数：
   *
   * 1. 显示成功提示
   * 2. 清空选中的行
   * 3. 刷新表格数据
   *
   * @example
   *   ```tsx
   *   async function handleBatchDelete() {
   *     await batchDeleteAPI(checkedRowKeys); // checkedRowKeys 类型为 ID[]，无需手动断言
   *     onBatchDeleted();
   *   }
   *   ```;
   */
  async function onBatchDeleted() {
    window.$message?.success(t('common.deleteSuccess'));
    setCheckedRowKeys([]);
    await getData(false);
  }

  /**
   * 单条删除后的处理
   *
   * 在单条删除成功后调用此函数：
   *
   * 1. 显示成功提示
   * 2. 刷新表格数据
   *
   * @example
   *   ```tsx
   *   async function handleDelete(id: ID) { // id 类型为 ID（如 number/string）
   *     await deleteAPI(id);
   *     onDeleted();
   *   }
   *   ```;
   */
  async function onDeleted() {
    window.$message?.success(t('common.deleteSuccess'));
    await getData(false);
  }

  /**
   * 提交表单
   *
   * 验证并提交表单数据：
   *
   * 1. 验证表单字段
   * 2. 调用 executeResActions 执行新增/编辑操作
   * 3. 如果操作成功，显示成功提示、关闭抽屉并刷新数据
   * 4. 如果操作失败，保持抽屉打开，让用户可以修改后重试
   */
  async function handleSubmit() {
    try {
      // 验证表单
      const res = await form.validateFields(); // 捕获异常

      // 执行新增或编辑操作（调用 API）
      const success = await executeResActions(res, operateType);

      // 只有操作成功时才关闭抽屉和刷新数据 (如果失败，保持抽屉打开，用户可以编辑后重试)
      if (success) {
        // 显示成功提示
        if (operateType === 'add') {
          window.$message?.success(t('common.addSuccess'));
        } else {
          window.$message?.success(t('common.updateSuccess'));
        }

        // 关闭抽屉
        onClose();

        // 刷新表格数据
        getData();
      }
    } catch (error: any) {
      // 遍历所有表单校验错误并打印
      if (error.errorFields && error.errorFields.length > 0) {
        console.log('==== 表单校验失败 ====');
        const errorLog = error.errorFields
          .map((field: any, index: number) => {
            const fieldName = field.name[0];
            const fieldErrors = field.errors.join('；');
            // 拼接单条错误信息（包含序号、字段名、错误信息）
            return `第${index + 1}个错误：【${fieldName}】${fieldErrors}`;
          })
          .join(' | '); // 多条错误用 | 分隔，一行输出

        console.warn('表单校验失败：', errorLog);
        console.log('======================');
      } else {
        // 非表单校验错误（如接口异常）
        console.error('提交失败：', error?.message || error);
      }
    }
  }

  // 返回表格操作所需的所有状态和方法
  return {
    /** 选中的行键数组（强类型：ID[]） */
    checkedRowKeys,

    /** 关闭抽屉函数 */
    closeDrawer,

    /** 抽屉显示状态 */
    drawerVisible,

    /** 正在编辑的行数据 */
    editingData,

    /**
     * 通用弹窗操作属性（传给抽屉组件）
     *
     * @example
     *   ```tsx
     *   <UserOperateDrawer {...generalPopupOperation} />
     *   ```;
     */
    generalPopupOperation: {
      form, // 表单实例
      handleSubmit, // 提交函数
      onClose, // 关闭函数
      open: drawerVisible, // 打开状态
      operateType // 操作类型
    },

    /** 处理新增操作 */
    handleAdd,

    /** 处理编辑操作（入参：ID | T） */
    handleEdit,

    /** 批量删除后的处理 */
    onBatchDeleted,

    /** 单条删除后的处理 */
    onDeleted,

    /** 行选择变化回调（入参：ID[]） */
    onSelectChange,

    /** 打开抽屉函数 */
    openDrawer,

    /** 操作类型（'add' | 'edit'） */
    operateType,

    /** 行选择配置（传给 Table 组件） */
    rowSelection
  };
}

// ==================== useTableScroll Hook ====================

/**
 * 表格滚动配置 Hook
 *
 * 自动计算表格的滚动区域尺寸，实现响应式滚动
 *
 * **核心功能：**
 *
 * - 水平滚动：当列太多时，表格可以左右滚动
 * - 垂直滚动：根据容器高度自动计算，表格可以上下滚动
 * - 响应式：容器尺寸变化时，自动重新计算滚动高度
 *
 * **使用场景：**
 *
 * - 表格列数很多，需要横向滚动
 * - 表格数据很多，需要纵向滚动
 * - 需要固定表头和分页，中间内容可滚动
 *
 * @example
 *   ```tsx
 *   function UserList() {
 *     const { scrollConfig, tableWrapperRef } = useTableScroll();
 *
 *     return (
 *       <Card ref={tableWrapperRef}>
 *         <Table scroll={scrollConfig} />
 *       </Card>
 *     );
 *   }
 *   ```;
 *
 * @example
 *   ```tsx
 *   // 自定义水平滚动宽度
 *   const { scrollConfig, tableWrapperRef } = useTableScroll(1200);
 *   ```;
 *
 * @param scrollX - 水平滚动宽度（默认 702px） 当表格总宽度超过这个值时，会出现横向滚动条
 * @returns 返回对象包含：
 * @returns scrollConfig - 表格滚动配置对象 { x, y }，传给 Table 组件
 * @returns tableWrapperRef - 表格容器的 ref，需绑定到包裹表格的元素上
 */
export function useTableScroll(scrollX: number = 702) {
  /**
   * 表格容器的引用
   *
   * 用于获取容器的尺寸信息 需要绑定到包裹表格的元素上（通常是 Card 或 div）
   */
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  /**
   * 监听容器尺寸变化
   *
   * useSize Hook 会监听 ref 元素的尺寸变化 当窗口大小改变时，自动更新 size 值
   */
  const size = useSize(tableWrapperRef);

  /**
   * 计算表格垂直滚动高度
   *
   * 计算公式：容器高度 - 160px
   *
   * - 160px 是预留给表头、分页器、边距等的空间
   * - 如果容器高度为空，返回 undefined（不限制高度）
   *
   * @returns 滚动高度（number）或 undefined
   */
  function getTableScrollY() {
    const height = size?.height;

    // 如果容器高度不存在，返回 undefined（表格不限制高度）
    if (!height) return undefined;

    // 容器高度 - 160px（表头、分页等占用的高度）
    return height - 160;
  }

  /**
   * 滚动配置对象
   *
   * 传给 Table 组件的 scroll 属性
   *
   * - x：水平滚动宽度，超过此宽度会出现横向滚动条
   * - y：垂直滚动高度，超过此高度会出现纵向滚动条
   */
  const scrollConfig = {
    x: scrollX, // 水平滚动宽度（固定值）
    y: getTableScrollY() // 垂直滚动高度（动态计算）
  };

  return {
    /**
     * 滚动配置对象
     *
     * @example
     *   ```tsx
     *   <Table scroll={scrollConfig} />
     *   ```;
     */
    scrollConfig,

    /**
     * 表格容器的 ref
     *
     * @example
     *   ```tsx
     *   <Card ref={tableWrapperRef}>
     *     <Table scroll={scrollConfig} />
     *   </Card>
     *   ```;
     */
    tableWrapperRef
  };
}
