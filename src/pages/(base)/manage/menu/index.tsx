import { Suspense } from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import { ATG_MAP, MenuTagMap, YesOrNo_Map, yesOrNoRecord } from '@/constants/common';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { pages } from '@/router/elegant/imports';
import { fetchGetMenuList, fetchMenuDeleteById, fetchSysMenuAdd, fetchSysMenuUpdate } from '@/service/api';
import { IconType } from '@/service/enums';

import MenuOperateModal from './modules/menu-operate-modal';
import type { OperateType } from './modules/shared';
import { createDefaultModel, extractRouteParamsFromTemplate, flattenMenu, getLayoutAndPage } from './modules/shared';

const ROOT_PARENT_ID = 0; // 根节点父级 ID

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
      menuName: null,
      menuType: null,
      parentId: ROOT_PARENT_ID,
      size: 10,
      status: null
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
        title: t('page.manage.menu.component'),
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
        title: t('page.manage.menu.keepAlive'),
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
        title: t('page.manage.menu.constant'),
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
        dataIndex: 'createTime',
        key: 'createTime', // 👈 必须有 key
        title: t('common.createTime'),
        width: 160
      },
      {
        align: 'center',
        dataIndex: 'updateTime',
        key: 'updateTime', // 👈 必须有 key
        title: t('common.updateTime'),
        width: 160
      },
      {
        align: 'center',
        fixed: 'right',
        key: 'operate',
        render: (_, record, index) => (
          <div className="flex-center justify-end gap-8px">
            {record.menuType === 1 && (
              <AuthAddButton
                auth={buttonAuthCode.system.menu.addChild}
                color="blue"
                icon={null}
                variant="outlined"
                onClick={() => handleAddChildMenu(record.menuId)}
              >
                {t('page.manage.menu.addChildMenu')}
              </AuthAddButton>
            )}
            <AuthEditButton
              auth={buttonAuthCode.system.menu.edit}
              onClick={() => edit(record, index)}
            />
            <AuthDeleteButton
              auth={buttonAuthCode.system.menu.delete}
              onClick={() => handleDelete(record)}
            />
          </div>
        ),
        title: t('common.operate'),
        width: 350
      }
    ],
    isChangeURL: false,
    pagination: {
      hideOnSinglePage: true
    },
    rowKey: 'menuId' // 是否同步 URL 参数（可选） false: 不同步，true: 同步到 URL
  });

  const menuList = useMemo(() => {
    const rootMenu = { label: '根菜单', value: ROOT_PARENT_ID };
    const rest = flattenMenu(data || []);
    return [rootMenu, ...rest];
  }, [data]);

  const { checkedRowKeys, generalPopupOperation, handleAdd, handleEdit, onDeleted, openDrawer, rowSelection } =
    useTableOperate({
      data,
      // 添加成功 返回true 【添加失败 返回false 不关闭抽屉】
      executeResActions: async (newData, type) => {
        // 操作结果标识
        let isSuccess = true;
        const queryArr = newData.query || [];
        const newDataCopy = { ...newData, query: JSON.stringify(queryArr) };
        try {
          // 根据操作类型调用不同的 API
          if (type === 'edit') {
            await fetchSysMenuUpdate(newDataCopy);
          } else {
            await fetchSysMenuAdd(newDataCopy);
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

  function onAdd() {
    setOperateType('add');
    handleAdd();
  }

  async function handleDelete(menu: Api.SystemManage.SysMenu) {
    if (menu.children && menu.children.length > 0) {
      window.$message?.error('请先删除子菜单，再删除该菜单！');
      return;
    }
    await fetchMenuDeleteById(menu.menuId);
    onDeleted();
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
    setOperateType('edit');
    handleEdit(itemData);
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
            addCode={buttonAuthCode.system.menu.add}
            columns={columnChecks}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            needPermission={true}
            refresh={run}
            setColumnChecks={setColumnChecks}
            showDelete={false}
            onDelete={() => {}}
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
