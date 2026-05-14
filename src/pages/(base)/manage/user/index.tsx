import { UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';
import { Suspense, lazy } from 'react';

import buttonAuthCode from '@/constants/btn-auth-code';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { ATG_MAP } from '@/constants/common';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { fetchUserAdd, fetchUserBatchDelete, fetchUserDeleteById, fetchUserList, fetchUserUpdate } from '@/service/api';

import UserSearch from './modules/UserSearch';

const UserOperateDrawer = lazy(() => import('./modules/UserOperateDrawer'));

const tagUserGenderMap: Record<Api.SystemManage.UserGender, string> = {
  1: 'processing',
  2: 'error'
};

// 定义循环使用的标签颜色（可根据业务调整/扩展）
const ROLE_TAG_COLORS = [
  'blue', // 索引0
  'green', // 索引1
  'orange', // 索引2
  'purple', // 索引3
  'cyan', // 索引4
  'magenta', // 索引5
  'lime' // 索引6
];

const UserManage = () => {
  const { t } = useTranslation();

  const nav = useNavigate();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    // API 请求函数
    apiFn: fetchUserList,
    // ⚠️ 重点：API 请求参数定义
    // 注意：
    // 1. 如果要在搜索表单中使用这些参数，必须在这里定义
    // 2. 可选参数必须设置为 null，不能是 undefined
    // 3. 不能是 undefined，否则表单字段将不是响应式的
    apiParams: {
      current: 1,
      size: 10,
      status: null,
      userEmail: null,
      userGender: null,
      userName: null,
      userNick: null,
      userPhone: null
    },
    columns: () => [
      {
        align: 'center',
        dataIndex: 'index',
        key: 'index', // 👈 必须有 key
        title: t('common.index'),
        width: 64
      },
      {
        align: 'center',
        dataIndex: 'userId',
        key: 'userId', // 👈 必须有 key
        title: t('page.manage.user.userId'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'avatar',
        key: 'avatar', // 👈 必须有 key
        render: (_, record) => {
          return record.avatar ? (
            <Avatar
              size={64}
              src={record.avatar}
            />
          ) : (
            <Avatar
              icon={<UserOutlined />}
              size={64}
            />
          );
        },
        title: t('page.manage.user.avatar'),
        width: 80
      },
      {
        align: 'center',
        dataIndex: 'userName',
        key: 'userName',
        minWidth: 100,
        title: t('page.manage.user.userName')
      },
      {
        align: 'center',
        dataIndex: 'userGender',
        key: 'userGender',
        render: (_, record) => {
          if (record?.userGender === null) {
            return null;
          }

          const label = t(userGenderRecord[record.userGender]);

          return <ATag color={tagUserGenderMap[record.userGender]}>{label}</ATag>;
        },
        title: t('page.manage.user.userGender'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'userNick',
        key: 'userNick',
        minWidth: 100,
        title: t('page.manage.user.nickName')
      },
      {
        align: 'center',
        dataIndex: 'userPhone',
        key: 'userPhone',
        title: t('page.manage.user.userPhone'),
        width: 120
      },
      {
        align: 'center',
        dataIndex: 'userEmail',
        key: 'userEmail',
        minWidth: 200,
        title: t('page.manage.user.userEmail')
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
        title: t('page.manage.user.userStatus'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'roleList',
        key: 'roleList',
        render: (_, record) => (
          <>
            {record.roleList?.map((role, index) => {
              const color = ROLE_TAG_COLORS[index % ROLE_TAG_COLORS.length];
              return (
                <Tooltip
                  key={role.roleId}
                  title={`角色编码：${role.roleCode}`}
                >
                  <ATag
                    className="mb-4px"
                    color={color}
                    key={role.roleId}
                  >
                    {role.roleName}
                  </ATag>
                </Tooltip>
              );
            })}
          </>
        ),
        title: t('page.manage.user.roleList')
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
        fixed: 'right',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <AuthEditButton
              auth={buttonAuthCode.system.user.edit}
              onClick={() => edit(record.userId)}
            />
            <AuthDetailButton
              auth={buttonAuthCode.system.user.detail}
              onClick={() => nav(`/manage/user/${record.userId}`)}
            />
            <AuthDeleteButton
              auth={buttonAuthCode.system.user.delete}
              onClick={() => handleDelete(record.userId)}
            />
          </div>
        ),
        title: t('common.operate'),
        width: 240
      }
    ],
    isChangeURL: false, // 是否同步 URL 参数（可选） false: 不同步，true: 同步到 URL
    pagination: {
      showQuickJumper: true
    },
    rowKey: 'userId' // 行唯一标识(ID)
  });

  const { checkedRowKeys, generalPopupOperation, handleAdd, handleEdit, onBatchDeleted, onDeleted, rowSelection } =
    useTableOperate({
      data,
      // 添加成功 返回true 【添加失败 返回false 不关闭抽屉】
      executeResActions: async (userData, type) => {
        // 操作结果标识
        let isSuccess = true;
        try {
          // 根据操作类型调用不同的 mutation
          if (type === 'add') {
            // 利用 React Query 的 mutateAsync 执行请求
            await fetchUserAdd(userData);
          } else {
            await fetchUserUpdate(userData);
          }
        } catch (error) {
          // 全局拦截器已处理错误提示，此处无需重复提示
          console.error(`${type === 'add' ? '新增' : '编辑'}用户失败：`, error);
          isSuccess = false;
        }

        // 返回布尔值控制抽屉是否关闭
        return isSuccess;
      },
      getData: run,
      rowKey: 'userId' // 行唯一标识(ID)
    });

  function handleBatchDelete() {
    fetchUserBatchDelete(checkedRowKeys).then(() => {
      // ✅ 只有请求成功，才调用 onBatchDeleted（刷新表格+提示成功）
      onBatchDeleted();
    });
  }

  function handleDelete(id: number) {
    fetchUserDeleteById(id).then(() => {
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
            children: <UserSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.user.title')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            addCode={buttonAuthCode.system.user.add}
            batchDeleteCode={buttonAuthCode.system.user.batchDel}
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
          size="small"
          scroll={{
            ...scrollConfig,
            x: 'max-content'
          }}
          {...tableProps}
        />
        <Suspense>
          <UserOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default UserManage;
