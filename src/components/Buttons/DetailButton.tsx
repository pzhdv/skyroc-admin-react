import { FileTextOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';

import type { SimpleButtonProps } from './type';
/** @Description: 表格详情按钮 组件 */
const DetailButton: React.FC<SimpleButtonProps> = ({
  children,
  disabled = false,
  onClick,
  size = 'middle',
  tooltip
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={tooltip}>
      <Button
        ghost
        color="orange"
        disabled={disabled}
        icon={<FileTextOutlined />}
        size={size}
        variant="solid"
        onClick={onClick}
      >
        {children ?? t('common.detail')}
      </Button>
    </Tooltip>
  );
};

export default DetailButton;
