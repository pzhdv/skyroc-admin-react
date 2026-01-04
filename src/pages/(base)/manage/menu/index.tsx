import { Suspense } from 'react';

import { enableStatusRecord, menuTypeRecord } from '@/constants/business';

import { MenuTagMap, ATG_MAP, YesOrNo_Map, yesOrNoRecord } from '@/constants/common';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { pages } from '@/router/elegant/imports';
import { fetchGetMenuList, fetchMenuDeleteById, fetchSysMenuAdd, fetchSysMenuUpdate } from '@/service/api';

import MenuOperateModal from './modules/menu-operate-modal';
import type { OperateType } from './modules/shared';
import { createDefaultModel, extractRouteParamsFromTemplate, flattenMenu, getLayoutAndPage } from './modules/shared';
import { IconType } from '@/service/enums';


const ROOT_PARENT_ID = 0;// 根节点父级 ID

const Menu = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const allPages = Object.keys(pages);

  const { columnChecks, data, run, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetMenuList,
    // ⚠️ 重点：API 请求参数定义
    // 注意：
    // 1. 如果要在搜索表单中使用这些参数，必须在这里定义
    // 2. 可选参数必须设置为 null，不能是 undefined
    // 3. 不能是 undefined，否则表单字段将不是响应式的
    apiParams: {
      current: 1,
      size: 10,
      menuName: null,
      menuType: null,
      status: null,
      parentId: ROOT_PARENT_ID
    },
    columns: () => [
      {
        align: 'center',
        dataIndex: 'menuId',
        key: 'menuId',
        title: t('page.manage.menu.id'),
        width: 80
      },
      {
        align: 'center',
        key: 'menuType',
        render: (_, record) => {
          if (record.menuType === null) {
            return null;
          }
          const label = t(menuTypeRecord[record.menuType]);
          return <ATag color={MenuTagMap[record.menuType]}>{label}</ATag>;
        },
        title: t('page.manage.menu.menuType'),
        width: 80
      },
      {
        align: 'center',
        key: 'menuName',
        render: (_, record) => {
          const { i18nKey, menuName } = record;
          const label = i18nKey ? t(i18nKey) : menuName;
          return <span>{label}</span>;
        },
        title: t('page.manage.menu.menuName'),
        width: 120
      },
      {
        align: 'center',
        key: 'icon',
        render: (_, record) => {
          const icon = record.iconType === IconType.ICONIFY ? record.icon : undefined;
          const localIcon = record.iconType === IconType.LOCAL ? record.icon : undefined;
          return (
            <div className="flex-center">
              <SvgIcon
                className="text-icon"
                icon={icon}
                localIcon={localIcon}
              />
            </div>
          );
        },
        title: t('page.manage.menu.icon'),
        width: 60
      },
      {
        align: 'center',
        dataIndex: 'routeName',
        key: 'routeName',
        title: t('page.manage.menu.routeName'),
        width: 120
      },
      {
        align: 'center',
        dataIndex: 'routePath',
        key: 'routePath',
        title: t('page.manage.menu.routePath'),
        width: 150
      },
      {
        align: 'center',
        dataIndex: 'component',
        key: 'component',
        title: "组件路径",
        width: 120
      },
      {
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          const label = t(enableStatusRecord[record.status]);
          return <ATag color={ATG_MAP[record.status]}>{label}</ATag>;
        },
        title: t('page.manage.menu.menuStatus'),
        width: 80
      },
      {
        align: 'center',
        dataIndex: 'keepAlive',
        key: 'keepAlive',
        render: (_, record) => {
          const hide: CommonType.YesOrNo = record.keepAlive ? 'Y' : 'N';
          const label = t(yesOrNoRecord[hide]);
          return <ATag color={YesOrNo_Map[hide]}>{label}</ATag>;
        },
        title: '缓存路由',
        width: 80
      },
      {
        align: 'center',
        dataIndex: 'constant',
        key: 'constant',
        render: (_, record) => {
          const hide: CommonType.YesOrNo = record.constant ? 'Y' : 'N';
          const label = t(yesOrNoRecord[hide]);
          return <ATag color={YesOrNo_Map[hide]}>{label}</ATag>;
        },
        title: '常量路由',
        width: 80
      },
      {
        align: 'center',
        dataIndex: 'hideInMenu',
        key: 'hideInMenu',
        render: (_, record) => {
          const hide: CommonType.YesOrNo = record.hideInMenu ? 'Y' : 'N';
          const label = t(yesOrNoRecord[hide]);
          return <ATag color={YesOrNo_Map[hide]}>{label}</ATag>;
        },
        title: t('page.manage.menu.hideInMenu'),
        width: 80
      },
      {
        align: 'center',
        dataIndex: 'parentId',
        key: 'parentId',
        title: t('page.manage.menu.parentId'),
        width: 90
      },
      {
        align: 'center',
        dataIndex: 'order',
        key: 'order',
        title: t('page.manage.menu.order'),
        width: 60
      },
      {
        align: 'center',
        dataIndex: 'createdTime',
        key: 'createdTime',
        title: '创建时间',
        width: 160
      },
      {
        align: 'center',
        dataIndex: 'updatedTime',
        key: 'updatedTime',
        title: '更新时间',
        width: 160
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record, index) => (
          <div className="flex-center justify-end gap-8px">
            {record.menuType === 1 && (
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => handleAddChildMenu(record.menuId)}
              >
                {t('page.manage.menu.addChildMenu')}
              </AButton>
            )}
            <AButton
              size="small"
              onClick={() => edit(record, index)}
            >
              {t('common.edit')}
            </AButton>
            <APopconfirm
              title={t('common.confirmDelete')}
              onConfirm={() => handleDelete(record)}
            >
              <AButton
                danger
                size="small"
              >
                {t('common.delete')}
              </AButton>
            </APopconfirm>
          </div>
        ),
        title: t('common.operate'),
        width: 200
      }
    ],
    rowKey: 'menuId',
    pagination: {
      hideOnSinglePage: true
    }
  });

  const menuList = useMemo(() => {
    const rootMenu = { label: "根菜单", value: ROOT_PARENT_ID };
    const rest = flattenMenu(data || []);
    return [rootMenu, ...rest];
  }, [data]);

  const {
    checkedRowKeys,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    openDrawer,
    onBatchDeleted,
    onDeleted,
    rowSelection
  } = useTableOperate({
    data,
    // 添加成功 返回true 【添加失败 返回false 不关闭抽屉】
    executeResActions: async (newData, type) => {
      // 操作结果标识
      let isSuccess = true;
      const queryArr = newData.query || []
      const newDataCopy = { ...newData, query: JSON.stringify(queryArr) }
      try {
        // 根据操作类型调用不同的 API
        if (type === 'add') {
          await fetchSysMenuAdd(newDataCopy)
        } else {
          await fetchSysMenuUpdate(newDataCopy)
        }
      } catch (error) {
        // 全局拦截器已处理错误提示，此处无需重复提示
        console.error(`${type === 'add' ? '新增' : '编辑'}菜单失败：`, error);
        isSuccess = false;
      }
      return isSuccess;
    },
    getData: run,
    rowKey: 'menuId' // 行唯一标识(ID)
  });

  const [operateType, setOperateType] = useState<OperateType>('add');

  async function handleBatchDelete() {
    // request

    onBatchDeleted();
  }

  function onAdd() {
    setOperateType('add');

    handleAdd();
  }

  function handleDelete(menu: Api.SystemManage.SysMenu) {
    if (menu.children && menu.children.length > 0) {
      window.$message?.error('请先删除子菜单，再删除该菜单！');
      return;
    }

    fetchMenuDeleteById(menu.menuId).then(() => {
      //  ✅ 只有请求成功，才调用 onDeleted（刷新表格+提示成功）
      onDeleted();
    })

  }

  function edit(item: Api.SystemManage.SysMenu, index: number) {
    const { component, ...rest } = item;
    try {
      const queryStr = item.query || '[]';
      rest.query = JSON.parse(queryStr);
    } catch (error) {
      rest.query = [];
    }
    const { layout, page } = getLayoutAndPage(component);
    const { param, path } = extractRouteParamsFromTemplate(rest.routePath);

    const itemData = Object.assign(createDefaultModel(), rest, {
      index,
      layout,
      page,
      pathParam: param,
      routePath: path
    });

    handleEdit(itemData);
    setOperateType('edit');
  }

  function handleAddChildMenu(id: number) {
    generalPopupOperation.form.setFieldsValue(Object.assign(createDefaultModel(), { parentId: id }));

    setOperateType('addChild');

    openDrawer();
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.menu.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={onAdd}
            columns={columnChecks}
            showDelete={false}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            onDelete={handleBatchDelete}
          />
        }
      >
        <ATable
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />

        <Suspense>
          <MenuOperateModal
            {...Object.assign(generalPopupOperation, { operateType })}
            allPages={allPages || []}
            menuList={menuList || []}
          />
        </Suspense>
      </ACard>
    </div>
  );
};

export default Menu;
