import { Tooltip } from 'antd';

import buttonAuthCode from '@/constants/btn-auth-code';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { fetchOpLogBatchDelete, fetchOpLogDeleteById, fetchOperationLogList } from '@/service/api';

import OperationLogSearch from './modules/OperationLogSearch';

const OperationLog = () => {
  const { t } = useTranslation();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    // API 请求函数
    apiFn: fetchOperationLogList,
    // ⚠️ 重点：API 请求参数定义
    // 注意：
    // 1. 如果要在搜索表单中使用这些参数，必须在这里定义
    // 2. 可选参数必须设置为 null，不能是 undefined
    // 3. 不能是 undefined，否则表单字段将不是响应式的
    apiParams: {
      beginTime: null,
      current: 1,
      endTime: null,
      maxCostTime: null,
      minCostTime: null,
      requestMethod: null,
      requestUrl: null,
      size: 50,
      username: null
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
        dataIndex: 'username',
        key: 'username',
        minWidth: 120,
        title: t('page.manage.log.title.username')
      },
      {
        align: 'center',
        dataIndex: 'requestUrl',
        key: 'requestUrl',
        minWidth: 200,
        title: t('page.manage.log.title.requestUrl')
      },
      {
        align: 'center',
        dataIndex: 'requestMethod',
        key: 'requestMethod',
        title: t('page.manage.log.title.requestMethod'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'description',
        key: 'description',
        minWidth: 150,
        title: t('page.manage.log.title.description')
      },
      {
        align: 'center',
        dataIndex: 'ipAddress',
        key: 'ipAddress',
        title: t('page.manage.log.title.ipAddress'),
        width: 150
      },
      {
        align: 'center',
        dataIndex: 'costTime',
        key: 'costTime',
        title: t('page.manage.log.title.costTime'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'createTime',
        key: 'createTime',
        title: t('page.manage.log.title.createTime'),
        width: 200
      },
      {
        align: 'center',
        dataIndex: 'requestParams',
        key: 'requestParams',
        onCell: () => ({
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }),
        render: (_, record) => (
          <Tooltip
            mouseEnterDelay={0.5}
            title={record.requestParams}
          >
            <span className="ellipsis-text">{record.requestParams}</span>
          </Tooltip>
        ),
        title: t('page.manage.log.title.requestParams'),
        width: 200
      },
      {
        align: 'center',
        dataIndex: 'responseResult',
        key: 'responseResult',
        onCell: () => ({
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }),
        render: (_, record) => (
          <Tooltip
            mouseEnterDelay={0.5}
            title={record.responseResult}
          >
            <span className="ellipsis-text">{record.responseResult}</span>
          </Tooltip>
        ),
        title: t('page.manage.log.title.responseResult'),
        width: 200
      },
      {
        align: 'center',
        dataIndex: 'userAgent',
        key: 'userAgent',
        onCell: () => ({
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }),
        render: (_, record) => (
          <Tooltip
            mouseEnterDelay={0.5}
            title={record.userAgent}
          >
            <span className="ellipsis-text">{record.userAgent}</span>
          </Tooltip>
        ),
        title: t('page.manage.log.title.userAgent'),
        width: 200
      },
      {
        align: 'center',
        key: 'operate',
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <AuthDeleteButton
              auth={buttonAuthCode.system.log.delete}
              onClick={() => handleDelete(record.id)}
            />
          </div>
        ),
        title: t('common.operate')
      }
    ],
    isChangeURL: false, // 是否同步 URL 参数（可选） false: 不同步，true: 同步到 URL
    pagination: {
      showQuickJumper: true
    },
    rowKey: 'id' // 行唯一标识(ID)
  });

  const { checkedRowKeys, onBatchDeleted, onDeleted, rowSelection } = useTableOperate({
    data,
    // 添加成功 返回true 【添加失败 返回false 不关闭抽屉】
    executeResActions: async () => {
      // 操作结果标识
      const isSuccess = true;
      // 返回布尔值控制抽屉是否关闭
      return isSuccess;
    },
    getData: run,
    rowKey: 'id' // 行唯一标识(ID)
  });

  async function handleBatchDelete() {
    await fetchOpLogBatchDelete(checkedRowKeys);
    //  请求成功，才调用 onDeleted（刷新表格+提示成功）
    onBatchDeleted();
  }

  async function handleDelete(id: number) {
    await fetchOpLogDeleteById(id);
    //  请求成功，才调用 onDeleted（刷新表格+提示成功）
    onDeleted();
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <OperationLogSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.log.tableTitle')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={() => {}}
            addCode="notbtn"
            batchDeleteCode={buttonAuthCode.system.log.batchDel}
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
      </ACard>
    </div>
  );
};

export default OperationLog;
