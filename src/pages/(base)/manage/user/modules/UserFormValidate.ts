import type { Rule } from 'antd/es/form';

/** 用户名正则表达式 允许中文、字母、数字、下划线和连字符，长度4-16位 */
import { REG_USER_NAME } from '@/constants/reg';
import { fetchCheckUserNameExist } from '@/service/api';

/**
 * 用户名校验规则
 *
 * @param dbOriginalUserName - 数据库中原始的用户名（编辑模式必传，新增模式传空字符串）
 * @param operateType - 操作类型（add/edit）
 * @returns 校验规则数组
 */
export function getUserNameRules(dbOriginalUserName: string, operateType: AntDesign.TableOperateType): Rule[] {
  return [
    {
      // 禁止纯空格
      message: '请输入用户名',
      required: true,
      whitespace: true
    },
    {
      message: '用户名只能包含中文、字母、数字、下划线和连字符，长度 4-16 位',
      pattern: REG_USER_NAME
    },
    {
      validateTrigger: 'onChange',
      validator: async (_, value) => {
        // 空值/纯空格：跳过（由 required 规则处理）
        if (!value || value.trim() === '') {
          return Promise.resolve();
        }

        const trimValue = value.trim();

        // 格式不合法：跳过（由 pattern 规则处理）
        if (!REG_USER_NAME.test(trimValue)) {
          return Promise.resolve();
        }

        // 编辑模式：用户名未变更则跳过校验
        if (operateType === 'edit' && dbOriginalUserName.trim() !== '') {
          if (trimValue === dbOriginalUserName) {
            return Promise.resolve();
          }
        }

        // 调用接口校验用户名是否已存在
        try {
          const isExist = await fetchCheckUserNameExist(trimValue);

          if (isExist) {
            return Promise.reject(new Error('该用户名已存在'));
          }
          return Promise.resolve();
        } catch (err) {
          console.error('用户名唯一性校验接口调用失败:', err);
          return Promise.reject(new Error('用户名唯一性校验失败，请稍后重试'));
        }
      }
    }
  ];
}
