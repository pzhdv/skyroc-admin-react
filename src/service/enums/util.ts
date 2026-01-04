/**
 * 严格的枚举值提取工具（无报错版）：
 *
 * - 数值枚举 → 仅提取数值（如 1 | 2）
 * - 字符串枚举 → 仅提取字符串（如 '1' | '2'） 彻底过滤数值枚举的反向映射（如 "ENABLED" | "DISABLED"）
 */
export type EnumValue<T> =
  // 第一步：过滤出枚举的「原始值」（排除反向映射的字符串键名）
  Extract<
    T[keyof T],
    // 只保留 number/string 类型（排除 symbol/object 等）
    number | string
  > extends infer RawValues
    ? // 第二步：如果是数值枚举，仅保留 number 类型；字符串枚举仅保留 string 类型
      RawValues extends number
      ? RawValues
      : RawValues extends string
        ? RawValues
        : never
    : never;
