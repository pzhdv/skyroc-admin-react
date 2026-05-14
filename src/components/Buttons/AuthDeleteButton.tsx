import { DeleteOutlined } from '@ant-design/icons';

import AuthBtn from './AuthBtn';
import type { AuthButtonProp } from './type';

/*
 *CRUD 权限删除按钮组件
 *上层封装：自带默认【删除】文案，children 可选
 *无权限时由底层 AuthBtn 自动隐藏
 */
export default function AuthDeleteButton(props: AuthButtonProp) {
  const { t } = useTranslation();
  const { auth, children, onClick, ...rest } = props;
  return (
    <APopconfirm
      title={t('common.confirmDelete')}
      onConfirm={() => onClick?.(undefined as any)}
    >
      <AuthBtn
        danger
        auth={auth}
        icon={<DeleteOutlined />}
        size="middle"
        {...rest}
      >
        {/* 有子元素则展示子元素，无则展示默认国际化删除文案 */}
        {children ?? t('common.delete')}
      </AuthBtn>
    </APopconfirm>
  );
}
