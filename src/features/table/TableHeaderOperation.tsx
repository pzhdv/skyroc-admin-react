import { Button, Popconfirm, Space } from 'antd';
import type { SpaceProps } from 'antd';
import classNames from 'classnames';
import React from 'react';
import type { FC } from 'react';

import DragContent from './DragContent';

interface Props {
  add: () => void;
  /** 新增按钮权限编码 */
  addCode?: string;
  /** 批量删除按钮权限编码 */
  batchDeleteCode?: string;
  children?: React.ReactNode;
  columns: AntDesign.TableColumnCheck[];
  disabledDelete?: boolean;
  itemAlign?: SpaceProps['align'];
  loading?: boolean;
  // 权限相关
  needPermission?: boolean;
  onDelete: () => void;
  prefix?: React.ReactNode;
  refresh: () => void;
  setColumnChecks: (checks: AntDesign.TableColumnCheck[]) => void;
  showDelete?: boolean;
  suffix?: React.ReactNode;
}

const TableHeaderOperation: FC<Props> = ({
  add,
  addCode,
  batchDeleteCode,
  children,
  columns,
  disabledDelete,
  itemAlign,
  loading,
  needPermission,
  onDelete,
  prefix,
  refresh,
  setColumnChecks,
  showDelete = true,
  suffix
}) => {
  const { t } = useTranslation();

  return (
    <Space
      wrap
      align={itemAlign}
      className="lt-sm:w-200px"
    >
      {prefix}
      {children || (
        <>
          {/* ========== 新增按钮：根据 needPermission 切换 AuthBtn / Button ========== */}
          {needPermission && addCode ? (
            <AuthAddButton
              auth={addCode}
              onClick={add}
            />
          ) : (
            <AddButton onClick={add} />
          )}

          {/* ========== 删除按钮：结构完全一样 ========== */}
          {showDelete &&
            (needPermission && batchDeleteCode ? (
              <AuthDeleteButton
                auth={batchDeleteCode}
                disabled={disabledDelete}
                onClick={onDelete}
              >
                {t('common.batchDelete')}
              </AuthDeleteButton>
            ) : (
              <DeleteButton
                disabled={disabledDelete}
                onClick={onDelete}
              >
                {t('common.batchDelete')}
              </DeleteButton>
            ))}
        </>
      )}
      <Button
        icon={<IconMdiRefresh className={classNames('text-icon', { 'animate-spin': loading })} />}
        size="small"
        onClick={refresh}
      >
        {t('common.refresh')}
      </Button>

      <APopover
        placement="bottomRight"
        trigger="click"
        content={
          <DragContent
            columns={columns}
            setColumnChecks={setColumnChecks}
          />
        }
        styles={{
          root: {
            // 动态传值
            height: '100%',
            maxHeight: '70vh',
            overflow: 'auto'
          }
        }}
      >
        <Button
          icon={<IconAntDesignSettingOutlined />}
          size="small"
        >
          {t('common.columnSetting')}
        </Button>
      </APopover>

      {suffix}
    </Space>
  );
};

export default TableHeaderOperation;
