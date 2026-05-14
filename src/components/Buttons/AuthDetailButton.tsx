import { FileTextOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import AuthBtn from './AuthBtn';
import type { AuthButtonProp } from './type';

/*
 *CRUD 权限详情按钮组件
 *上层封装：自带默认【详情】文案，children 可选
 *无权限时由底层 AuthBtn 自动隐藏
 */
export default function AuthDetailButton(props: AuthButtonProp) {
  const { t } = useTranslation();
  const { auth, children, tooltip, ...rest } = props;
  return (
    <Tooltip title={tooltip}>
      <AuthBtn
        ghost
        auth={auth}
        color="orange"
        icon={<FileTextOutlined />}
        size="middle"
        variant="solid"
        {...rest}
      >
        {/* 有子元素则展示子元素，无则展示默认国际化详情文案 */}
        {children ?? t('common.detail')}
      </AuthBtn>
    </Tooltip>
  );
}
