import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import AuthBtn from './AuthBtn';
import type { AuthButtonProp } from './type';

/*
 *CRUD 权限编辑按钮组件
 *上层封装：自带默认【编辑】文案，children 可选
 *无权限时由底层 AuthBtn 自动隐藏
 */
export default function AuthEditButton(props: AuthButtonProp) {
  const { t } = useTranslation();
  const { auth, children, tooltip, ...rest } = props;
  return (
    <Tooltip title={tooltip}>
      <AuthBtn
        ghost
        auth={auth}
        icon={<EditOutlined />}
        size="middle"
        type="primary"
        {...rest}
      >
        {/* 有子元素则展示子元素，无则展示默认国际化编辑文案 */}
        {children ?? t('common.edit')}
      </AuthBtn>
    </Tooltip>
  );
}
