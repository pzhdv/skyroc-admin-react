import type { Rule } from 'antd/es/form';

import { fetchCheckSysButtonCodeExists } from '@/service/api';

// 按钮编码规则：首字符为字母，必须包含冒号且冒号前后仅允许字母、数字、下划线和冒号
const BUTTON_CODE_REGEX = /^[a-zA-Z][a-zA-Z0-9:_]*:[a-zA-Z0-9:_]+$/;
/**
 * 按钮编码校验规则
 *
 * @param dbOriginalButtonCode - 数据库中原始的按钮编码（编辑模式必传，新增模式传空字符串）
 * @param operateType - 操作类型（add/edit）
 * @returns 校验规则数组
 */
export function getButtonCodeRules(dbOriginalButtonCode: string, operateType: AntDesign.TableOperateType): Rule[] {
  return [
    {
      message: '请输入按钮编码',
      required: true,
      whitespace: true // 禁止纯空格
    },
    {
      message: '首字符为字母，必须包含冒号且冒号前后仅允许字母、数字、下划线和冒号',
      pattern: BUTTON_CODE_REGEX
    },
    {
      validateTrigger: 'onChange',
      validator: async (_, value) => {
        // 空值/纯空格：跳过（由 required 规则处理）
        if (!value || value.trim() === '') {
          return Promise.resolve();
        }

        // 格式不合法：跳过（由 pattern 规则处理）
        const trimValue = value.trim();
        if (!BUTTON_CODE_REGEX.test(trimValue)) {
          return Promise.resolve();
        }

        // 编辑模式：编码未变更则跳过校验
        if (operateType === 'edit' && dbOriginalButtonCode.trim() !== '') {
          if (trimValue === dbOriginalButtonCode) {
            return Promise.resolve();
          }
        }

        // 调用接口校验唯一性
        try {
          // 适配接口返回格式（根据实际情况调整：若直接返回boolean则保留原写法）
          const res = await fetchCheckSysButtonCodeExists(trimValue);
          const isExist = res; // 若接口直接返回boolean，改为 const isExist = res;

          if (isExist) {
            return Promise.reject(new Error('该按钮编码已存在'));
          }
          return Promise.resolve();
        } catch (err: any) {
          const errMsg = '按钮编码唯一性校验失败，请稍后重试';
          console.error('按钮编码唯一性校验接口调用失败:', err);
          return Promise.reject(new Error(errMsg));
        }
      }
    }
  ];
}
