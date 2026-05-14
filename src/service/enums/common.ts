/** 通用枚举类型 */

import type { EnumValue } from './util';

/**
 * 启用状态
 *
 * - 1: 启用
 * - 2: 禁用
 */
export enum EnableStatus {
  /** 启用 */
  ENABLED = 1,
  /** 禁用 */
  DISABLED = 2
}

export type EnableStatusValue = EnumValue<typeof EnableStatus>;

/** 请求方式枚举 */
export enum RequestMethod {
  /** DELETE 删除 */
  DELETE = 'DELETE',
  /** GET 查询 */
  GET = 'GET',
  /** POST 新增 */
  POST = 'POST',
  /** PUT 修改 */
  PUT = 'PUT'
}

/** 请求方法值类型 */
export type RequestMethodValue = EnumValue<typeof RequestMethod>;
