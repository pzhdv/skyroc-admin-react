import { $t } from '@/locales';

/**
 * Transform record to option（支持数字/字符串键，保留原始类型）
 *
 * @example
 *   ```ts
 *   // 数字键示例
 *   const record = {
 *     1: '男',
 *     2: '女'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 1, label: '男' },
 *   //   { value: 2, label: '女' }
 *   // ]
 *
 *   // 字符串键示例
 *   const record2 = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options2 = transformRecordToOption(record2);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<
  // 泛型约束：键支持 string | number，值为 string
  T extends Record<string | number, string>
>(record: T) {
  return Object.entries(record).map(([keyStr, label]) => {
    // 尝试把字符串键转为数字（仅当键是纯数字时）
    const isNumberKey = /^\d+$/.test(keyStr);
    const value = isNumberKey ? Number(keyStr) : keyStr;
    return {
      label,
      value
    };
    // 类型推导：value 为 T 的键类型（string | number）
  }) as CommonType.Option<keyof T>[];
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions<K>(options: CommonType.Option<K>[]) {
  // 兼容空数组：避免空数组调用 map 报错
  if (!options || options.length === 0) return [];

  return options.map(option => ({
    ...option,
    // 若 label 是国际化 key，需断言为 I18nKey 后传入 $t
    label: $t(option.label as App.I18n.I18nKey)
  }));
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove
  };
}

export function getKeys(obj: Record<string, any>, parentKeys: string[] = []): string[] {
  let keys: string[] = [];

  for (const key in obj) {
    if (key) {
      const newKeys = [...parentKeys, key];
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(getKeys(obj[key], newKeys));
      } else {
        keys = newKeys;
      }
    }
  }

  return keys;
}
