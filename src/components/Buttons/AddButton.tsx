import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';

import type { SimpleButtonProps } from './type';

/** @Description: 表格新增按钮 组件 */
const AddButton: React.FC<SimpleButtonProps> = ({ children, disabled = false, onClick, size = 'middle', tooltip }) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      placement="top"
      title={tooltip}
    >
      <Button
        disabled={disabled}
        icon={<PlusOutlined />}
        size={size}
        type="primary"
        onClick={onClick}
      >
        {children ?? t('common.add')}
      </Button>
    </Tooltip>
  );
};

export default AddButton;
