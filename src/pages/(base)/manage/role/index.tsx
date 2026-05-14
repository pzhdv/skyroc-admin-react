import { Tooltip } from 'antd';
import { Suspense } from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';
import { enableStatusRecord } from '@/constants/business';
import { ATG_MAP } from '@/constants/common';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchGetRoleList,
  fetchRoleAdd,
  fetchRoleBatchDelete,
  fetchRoleDeleteById,
  fetchRoleEdit
} from '@/service/api';

import RoleSearch from './modules/role-search';

const RoleOperateDrawer = lazy(() => import('./modules/role-operate-drawer'));

const Role = () => {
  const { t } = useTranslation();

  const isMobile = useMobile();

  const nav = useNavigate();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetRoleList,
    // ⚠️ 重点：API 请求参数定义
    // 注意：
    // 1. 如果要在搜索表单中使用这些参数，必须在这里定义
    // 2. 可选参数必须设置为 null，不能是 undefined
    // 3. 不能是 undefined，否则表单字段将不是响应式的
    apiParams: {
      current: 1,
      roleCode: null,
      roleName: null,
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
      // {
      //   align: 'center',
      //   dataIndex: 'roleId',
      //   key: 'roleId',
      //   minWidth: 120,
      //   title: "角色ID"
      // },
      {
        align: 'center',
        dataIndex: 'roleName',
        key: 'roleName',
        minWidth: 120,
        title: t('page.manage.role.roleName')
      },
      {
        align: 'center',
        dataIndex: 'roleCode',
        key: 'roleCode',
        minWidth: 120,
        title: t('page.manage.role.roleCode')
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
        title: t('page.manage.role.roleStatus'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'roleDesc',
        key: 'roleDesc',
        onCell: () => {
          return {
            style: {
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          };
        },
        render: (_, record) => (
          <Tooltip
            mouseEnterDelay={0.5}
            title={record.roleDesc}
          >
            <span className="ellipsis-text">{record.roleDesc}</span>
          </Tooltip>
        ),
        title: t('page.manage.role.roleDesc'),
        width: 200
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
              auth={buttonAuthCode.system.role.edit}
              onClick={() => edit(record.roleId)}
            />
            <AuthDetailButton
              auth={buttonAuthCode.system.role.detail}
              onClick={() => nav(`/manage/role/${record.roleId}/${record.roleName}/${record.status}`)}
            />
            <AuthDeleteButton
              auth={buttonAuthCode.system.role.delete}
              onClick={() => handleDelete(record.roleId)}
            />
          </div>
        ),
        title: t('common.operate'),
        width: 240
      }
    ],
    isChangeURL: false, // 行唯一标识(ID)
    pagination: {
      hideOnSinglePage: true
    }, // 是否同步 URL 参数（可选） false: 不同步，true: 同步到 URL
    rowKey: 'roleId'
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
          await fetchRoleAdd(newData);
        } else {
          await fetchRoleEdit(newData);
        }
      } catch (error) {
        // 全局拦截器已处理错误提示，此处无需重复提示
        console.error(`${type === 'add' ? '新增' : '编辑'}用户失败：`, error);
        isSuccess = false;
      }
      return isSuccess;
    },
    getData: run,
    rowKey: 'roleId' // 行唯一标识(ID)
  });

  function handleBatchDelete() {
    // 空值校验：无选中数据时直接返回，避免无效请求
    if (checkedRowKeys.length === 0) {
      console.warn('[批量删除] 未选中任何数据，取消批量删除操作');
      return;
    }
    fetchRoleBatchDelete(checkedRowKeys).then(() => {
      // ✅ 只有请求成功，才调用 onBatchDeleted（刷新表格+提示成功）
      onBatchDeleted();
    });
  }

  function handleDelete(id: number) {
    // request
    fetchRoleDeleteById(id).then(() => {
      //  ✅ 只有请求成功，才调用 onDeleted（刷新表格+提示成功）
      onDeleted();
    });
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
            children: <RoleSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.role.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addCode={buttonAuthCode.system.role.add}
            batchDeleteCode={buttonAuthCode.system.role.batchDel}
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
          <RoleOperateDrawer
            {...generalPopupOperation}
            rowId={editingData?.roleId || -1}
          />
        </Suspense>
      </ACard>
    </div>
  );
};

export default Role;
