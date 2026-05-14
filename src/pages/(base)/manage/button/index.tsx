import { Suspense } from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';
import { enableStatusRecord } from '@/constants/business';
import { ATG_MAP } from '@/constants/common';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchGetSysButtonListByConditionPage,
  fetchRoleSysButtonBatchDelete,
  fetchSysButtonAdd,
  fetchSysButtonById,
  fetchSysButtonEdit
} from '@/service/api';
import { useAllPages } from '@/service/hooks/useSystemManage';

import ButtonSearch from './modules/button-search';

const ButtonOperateDrawer = lazy(() => import('./modules/button-operate-drawer'));

const SysButton = () => {
  const { t } = useTranslation();

  const isMobile = useMobile();

  // 获取所有菜单页面数据
  const { data: allPages = [] } = useAllPages();
  // 将后端返回的页面列表转换为选项格式
  const pageSelectOptions = useMemo(() => {
    return allPages
      .filter(menu => !menu.href) // 过滤：只保留没有 href 的菜单（排除外链，外链不需要按钮）
      .filter(menu => !menu.routePath?.includes('/exception/')) // 新增：排除 routePath 包含 /exception/ 的菜单
      .map(menu => ({
        label: menu.i18nKey ? t(menu.i18nKey) : menu.menuName,
        value: menu.menuId
      }));
  }, [allPages, t]);

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetSysButtonListByConditionPage,
    // ⚠️ 重点：API 请求参数定义
    // 注意：
    // 1. 如果要在搜索表单中使用这些参数，必须在这里定义
    // 2. 可选参数必须设置为 null，不能是 undefined
    // 3. 不能是 undefined，否则表单字段将不是响应式的
    apiParams: {
      current: 1,
      menuId: null,
      size: 10,
      status: null
    },
    columns: () => [
      {
        align: 'center',
        dataIndex: 'index',
        key: 'index',
        title: t('common.index'),
        width: 64
      },

      {
        align: 'center',
        dataIndex: 'menuName',
        key: 'menuName',
        minWidth: 120,
        render: (_, record) => {
          const label = record.menuI18nKey ? t(record.menuI18nKey) : record.menuName;
          return label;
        },
        title: t('page.manage.button.selectMenuName')
      },
      {
        align: 'center',
        dataIndex: 'buttonCode',
        key: 'buttonCode',
        minWidth: 120,
        title: t('page.manage.button.buttonCode')
      },
      {
        align: 'center',
        dataIndex: 'buttonName',
        key: 'buttonName',
        minWidth: 120,
        title: t('page.manage.button.buttonName')
      },

      {
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          if (record.status === null) {
            return null;
          }
          const label = t(enableStatusRecord[record.status]);
          return <ATag color={ATG_MAP[record.status]}>{label}</ATag>;
        },
        title: t('page.manage.button.buttonStatus'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'createTime',
        key: 'createTime', // 👈 必须有 key
        title: t('common.createTime'),
        width: 200
      },
      {
        align: 'center',
        dataIndex: 'updateTime',
        key: 'updateTime', // 👈 必须有 key
        title: t('common.updateTime'),
        width: 200
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <AuthEditButton
              auth={buttonAuthCode.system.button.edit}
              onClick={() => edit(record.buttonId)}
            />
            <AuthDeleteButton
              auth={buttonAuthCode.system.button.delete}
              onClick={() => handleDelete(record.buttonId)}
            />
          </div>
        ),
        title: t('common.operate'),
        width: 195
      }
    ],
    isChangeURL: false, // 是否同步 URL 参数（可选） false: 不同步，true: 同步到 URL
    rowKey: 'buttonId' // 行唯一标识(ID)
  });

  const {
    checkedRowKeys,
    editingData,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    rowSelection
  } = useTableOperate({
    data,
    // 添加成功 返回true 【添加失败 返回false 不关闭抽屉】
    executeResActions: async (newData, type) => {
      // 操作结果标识
      let isSuccess = true;

      try {
        // 根据操作类型调用不同的 API
        if (type === 'add') {
          await fetchSysButtonAdd(newData);
          console.log('添加', newData);
        } else {
          await fetchSysButtonEdit(newData);
          console.log('编辑', newData);
        }
      } catch (error) {
        // 全局拦截器已处理错误提示，此处无需重复提示
        console.error(`${type === 'add' ? '新增' : '编辑'}用户失败：`, error);
        isSuccess = false;
      }
      return isSuccess;
    },
    getData: run,
    rowKey: 'buttonId' // 行唯一标识(ID)
  });

  async function handleBatchDelete() {
    // 空值校验：无选中数据时直接返回，避免无效请求
    if (checkedRowKeys.length === 0) {
      console.warn('[批量删除] 未选中任何数据，取消批量删除操作');
      return;
    }
    await fetchRoleSysButtonBatchDelete(checkedRowKeys);
    // 请求成功，才调用 onBatchDeleted（刷新表格+提示成功）
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    // request
    await fetchSysButtonById(id);
    //  请求成功，才调用 onDeleted（刷新表格+提示成功）
    onDeleted();
  }

  function edit(id: number) {
    handleEdit(id);
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: (
              <ButtonSearch
                {...searchProps}
                pageSelectOptions={pageSelectOptions}
              />
            ),
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.button.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addCode={buttonAuthCode.system.button.add}
            batchDeleteCode={buttonAuthCode.system.button.batchDel}
            columns={columnChecks}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            needPermission={true}
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
          <ButtonOperateDrawer
            {...generalPopupOperation}
            buttonId={editingData?.buttonId || -1}
            pageSelectOptions={pageSelectOptions}
          />
        </Suspense>
      </ACard>
    </div>
  );
};

export default SysButton;
