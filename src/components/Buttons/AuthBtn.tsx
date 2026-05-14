import { useAuth } from '@/features/auth';

import type { AuthBtnProps } from './type';

// 权限按钮组件
// 1. 核心权限控制组件，必须传入内容才能渲染
// 2. 无权限时不渲染（由 hasAuth 控制）
// 3. 上层封装：提供了 AuthEditButton/AuthAddButton 等组件，内置默认文案，children 可选
export default function AuthBtn(props: AuthBtnProps) {
  const { hasAuth } = useAuth();

  const { auth, children, ...rest } = props;

  // 无权限 → 不渲染
  if (!hasAuth(auth)) {
    return null;
  }

  // 有权限 → 渲染按钮
  return <AButton {...rest}>{children}</AButton>;
}
