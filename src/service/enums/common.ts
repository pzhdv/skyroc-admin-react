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
