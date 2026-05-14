import { EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';

import type { SimpleButtonProps } from './type';
/** @Description: 表格查看按钮 组件 */
const ViewButton: React.FC<SimpleButtonProps> = ({ children, disabled = false, onClick, size = 'middle', tooltip }) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={tooltip}>
      <Button
        color="cyan"
        disabled={disabled}
        icon={<EyeOutlined />}
        size={size}
        variant="solid"
        onClick={onClick}
      >
        {children ?? t('common.view')}
      </Button>
    </Tooltip>
  );
};

export default ViewButton;
