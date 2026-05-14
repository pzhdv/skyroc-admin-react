import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import AuthBtn from './AuthBtn';
import type { AuthButtonProp } from './type';
/*
 *CRUD 权限新增按钮组件
 *上层封装：自带默认【新增】文案，children 可选
 *无权限时由底层 AuthBtn 自动隐藏
 */
export default function AuthAddButton(props: AuthButtonProp) {
  const { t } = useTranslation();
  const { auth, children, tooltip, ...rest } = props;
  return (
    <Tooltip title={tooltip}>
      <AuthBtn
        auth={auth}
        icon={<PlusOutlined />}
        size="middle"
        type="primary"
        {...rest}
      >
        {children ?? t('common.add')}
      </AuthBtn>
    </Tooltip>
  );
}
