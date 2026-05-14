import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';

import type { SimpleButtonProps } from './type';

/** 表格删除按钮 组件 */
const DeleteButton: React.FC<SimpleButtonProps> = ({ children, disabled = false, onClick, size = 'middle' }) => {
  const { t } = useTranslation();
  return (
    <Popconfirm
      title={t('common.confirmDelete')}
      onConfirm={onClick}
    >
      <Button
        danger
        disabled={disabled}
        icon={<DeleteOutlined />}
        size={size}
      >
        {children ?? t('common.delete')}
      </Button>
    </Popconfirm>
  );
};

export default DeleteButton;
