import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  1: 'page.manage.common.status.enable',
  2: 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  1: 'page.manage.user.gender.male',
  2: 'page.manage.user.gender.female'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  1: 'page.manage.menu.type.directory',
  2: 'page.manage.menu.type.menu'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.iconType.iconify',
  '2': 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

/** 请求方式 国际化映射 */
export const requestMethodRecord: Record<Api.SystemManage.RequestMethod, App.I18n.I18nKey> = {
  DELETE: 'page.manage.log.method.delete',
  GET: 'page.manage.log.method.get',
  POST: 'page.manage.log.method.post',
  PUT: 'page.manage.log.method.put'
};

/** 请求方式下拉选项 */
export const requestMethodOptions = transformRecordToOption(requestMethodRecord);
