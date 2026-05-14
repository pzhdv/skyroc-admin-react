import chalk from 'chalk';

import { transformRecordToOption } from '@/utils/common';

/** 全局头部菜单ID */
export const GLOBAL_HEADER_MENU_ID = '__GLOBAL_HEADER_MENU__';

/** 全局侧边菜单ID */
export const GLOBAL_SIDER_MENU_ID = '__GLOBAL_SIDER_MENU__';

/** 登录模块类型映射 */
export const loginModuleRecord: Record<UnionKey.LoginModule, App.I18n.I18nKey> = {
  'code-login': 'page.login.codeLogin.title',
  'pwd-login': 'page.login.pwdLogin.title',
  register: 'page.login.register.title',
  'reset-pwd': 'page.login.resetPwd.title'
};

/** 主题布局模式映射 */
export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, App.I18n.I18nKey> = {
  horizontal: 'theme.layoutMode.horizontal',
  'horizontal-mix': 'theme.layoutMode.horizontal-mix',
  vertical: 'theme.layoutMode.vertical',
  'vertical-mix': 'theme.layoutMode.vertical-mix'
};

export const themeLayoutModeOptions = transformRecordToOption(themeLayoutModeRecord);

/** 主题滚动模式映射 */
export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, App.I18n.I18nKey> = {
  content: 'theme.scrollMode.content',
  wrapper: 'theme.scrollMode.wrapper'
};

export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord);

/** 主题标签页模式映射 */
export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, App.I18n.I18nKey> = {
  button: 'theme.tab.mode.button',
  chrome: 'theme.tab.mode.chrome',
  slider: 'theme.tab.mode.slider'
};

export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord);

/** 页面切换动画模式映射 */
export const themePageAnimationModeRecord: Record<UnionKey.ThemePageAnimateMode, App.I18n.I18nKey> = {
  fade: 'theme.page.mode.fade',
  'fade-bottom': 'theme.page.mode.fade-bottom',
  'fade-scale': 'theme.page.mode.fade-scale',
  'fade-slide': 'theme.page.mode.fade-slide',
  none: 'theme.page.mode.none',
  'zoom-fade': 'theme.page.mode.zoom-fade',
  'zoom-out': 'theme.page.mode.zoom-out'
};

export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord);

/** 深色模式类名 */
export const DARK_CLASS = 'dark';

/** 项目启动控制台欢迎信息（醒目彩色版） 启动项目时自动打印 */
export const info = `
╭───────────────────────────────────────────────────╮
│  🚀 skyroc-admin-react 后台管理系统
│
│  项目描述：React 开源后台管理模板
│  技术栈：React18 + TypeScript + Vite + Ant Design
│  仓库地址：https://github.com/pzhdv/skyroc-admin-react
╰───────────────────────────────────────────────────╯
`;
