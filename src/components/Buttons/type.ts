import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';

/** 自定义简单按钮基础属性 */
export interface SimpleButtonProps {
  /** 按钮内容（可选） */
  children?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onClick: () => void;
  /** 按钮尺寸 */
  size?: 'large' | 'middle' | 'small';
  /** 悬浮提示 */
  tooltip?: string;
}

/** 【CRUD 上层】权限编辑按钮 Props 用于列表/表单里的编辑按钮 children 可选，不传自动显示默认“编辑”文案 */
export interface AuthButtonProp extends ButtonProps {
  /** 权限编码 */
  auth: string;
  /** 按钮内容（可选，不传使用默认国际化文案） */
  children?: ReactNode;
  /** 悬浮提示（可选） */
  tooltip?: string;
}

/** 【CRUD 底层】基础权限按钮 Props 权限控制核心按钮，必须传入内容才能渲染 所有权限按钮的底层封装 */
export interface AuthBtnProps extends ButtonProps {
  /** 权限编码 */
  auth: string;
  /** 按钮内容（必传） */
  children: ReactNode;
}
