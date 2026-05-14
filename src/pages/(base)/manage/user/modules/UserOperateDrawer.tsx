import { Button, Drawer, Flex, Form, Input, Radio, Select } from 'antd';
import type { FC } from 'react';

import UploadImage from '@/components/UploadImage';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { useFormRules } from '@/features/form';
import { EnableStatus, UserGender } from '@/service/enums';
import { useAllRoles } from '@/service/hooks';

import { getUserNameRules } from './UserFormValidate';

interface OptionsProps {
  label: string;
  value: number;
}

type Model = Pick<
  Api.SystemManage.SystemUser,
  | 'avatar'
  | 'password'
  | 'roleIds'
  | 'status'
  | 'userEmail'
  | 'userGender'
  | 'userId'
  | 'userName'
  | 'userNick'
  | 'userPhone'
>;

type RuleKey = Extract<keyof Model, 'avatar' | 'status' | 'userGender' | 'userNick'>;

function getOptions(item: Api.SystemManage.RoleSimple) {
  return {
    label: `${item.roleName}/${item.roleCode}`,
    value: item.roleId
  };
}

/**
 * 用户操作抽屉组件
 *
 * @param form - 表单实例
 * @param handleSubmit - 提交表单处理函数
 * @param onClose - 关闭抽屉回调
 * @param open - 抽屉打开状态
 * @param operateType - 操作类型（'add' | 'edit'）
 */
const UserOperateDrawer: FC<Page.OperateDrawerProps> = ({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();

  const { data, refetch } = useAllRoles();
  // 组件挂载时缓存初始值
  const [initialUserName, setInitialUserName] = useState('');

  const {
    defaultRequiredRule,
    formRules: { email, phone, pwd }
  } = useFormRules();

  const roleOptions: OptionsProps[] = data ? data.map(getOptions) : [];

  const rules: Record<RuleKey, App.Global.FormRule> = {
    avatar: defaultRequiredRule,
    status: defaultRequiredRule,
    userGender: defaultRequiredRule,
    userNick: defaultRequiredRule
  };

  // 用户名校验规则
  const userNameRules = getUserNameRules(initialUserName, operateType);

  // 根据操作类型获取密码字段的校验规则
  const getPasswordRules = (type: 'add' | 'edit') => {
    if (type === 'add') {
      return [...pwd];
    }
    // 编辑状态下密码可不填
    return [
      {
        ...pwd[1],
        required: false
      }
    ];
  };

  // 监听表单中的头像字段值，用于回填
  const avatarValue = Form.useWatch('avatar', form);

  // 处理文件更改事件
  const handleUploadImageChange = useCallback(
    (newFile: string | undefined) => {
      form.setFieldsValue({ avatar: newFile });
    },
    [form]
  );

  // 抽屉打开时的初始化逻辑
  useEffect(() => {
    if (open) {
      // 1. 刷新角色列表（确保最新）
      refetch().catch(err => console.error('刷新角色列表失败：', err));

      // 2. 新增时初始化默认值
      if (operateType === 'add') {
        form.setFieldsValue({
          status: EnableStatus.ENABLED,
          userGender: UserGender.MALE
        });
        // 新增模式：清空原始用户名
        setInitialUserName('');
      } else {
        // 编辑时缓存初始用户名
        const userName = form.getFieldValue('userName');
        setInitialUserName(userName);
      }
    }
  }, [form, open, operateType, refetch]); // 依赖完整，避免闭包问题

  return (
    <Drawer
      open={open}
      title={operateType === 'add' ? t('page.manage.user.addUser') : t('page.manage.user.editUser')}
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      <Form
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        {/* 用户ID - 隐藏字段 */}
        <Form.Item
          hidden
          name="userId"
        >
          <Input type="hidden" />
        </Form.Item>

        {/* 用户头像 - 必填 */}
        <Form.Item
          label="头像"
          name="avatar"
          rules={[rules.avatar]}
        >
          <UploadImage
            borderRadius={60}
            height={120}
            initFile={avatarValue}
            isShowPreview={false}
            width={120}
            onChange={handleUploadImageChange}
          />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userGender')}
          name="userGender"
          rules={[rules.userGender]}
        >
          <Radio.Group>
            {userGenderOptions.map(item => (
              <Radio
                key={item.value}
                value={item.value}
              >
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userName')}
          name="userName"
          rules={userNameRules}
        >
          <Input
            disabled={operateType === 'edit'}
            placeholder={t('page.manage.user.form.userName')}
          />
        </Form.Item>
        <Form.Item
          label={t('page.manage.user.userPassword')}
          name="password"
          rules={getPasswordRules(operateType)}
        >
          <Input.Password placeholder={operateType === 'add' ? '请输入登录密码' : '如需修改密码请输入新密码'} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.nickName')}
          name="userNick"
          rules={[rules.userNick]}
        >
          <Input placeholder={t('page.manage.user.form.nickName')} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userPhone')}
          name="userPhone"
          rules={phone}
        >
          <Input placeholder={t('page.manage.user.form.userPhone')} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userEmail')}
          name="userEmail"
          rules={email}
        >
          <Input placeholder={t('page.manage.user.form.userEmail')} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userStatus')}
          name="status"
          rules={[rules.status]}
        >
          <Radio.Group>
            {enableStatusOptions.map(item => (
              <Radio
                key={item.value}
                value={item.value}
              >
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userRole')}
          name="roleIds"
        >
          <Select
            mode="multiple"
            options={roleOptions}
            placeholder={t('page.manage.user.form.userRole')}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserOperateDrawer;
