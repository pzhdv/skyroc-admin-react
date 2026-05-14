import { enableStatusOptions } from '@/constants/business';
import { useFormRules } from '@/features/form';
import { EnableStatus } from '@/service/enums';

import { getRoleCodeRules } from './RoleFormValidate';
import ButtonAuthModal from './button-auth-modal';
import MenuAuthModal from './menu-auth-modal';

type Props = Page.OperateDrawerProps & { rowId: number };

type Model = Pick<Api.SystemManage.SysRole, 'roleCode' | 'roleDesc' | 'roleName' | 'status'>;

type RuleKey = Exclude<keyof Model, 'roleCode' | 'roleDesc'>;

const RoleOperateDrawer: FC<Props> = memo(({ form, handleSubmit, onClose, open, operateType, rowId }) => {
  const { t } = useTranslation();

  // 组件挂载时缓存初始值
  const [initialRoleCode, setInitialRoleCode] = useState('');

  const { createRequiredRule, defaultRequiredRule } = useFormRules();

  const [buttonAuthVisible, { setFalse: closeButtonAuthModal, setTrue: openButtonAuthModal }] = useBoolean();

  const [menuAuthVisible, { setFalse: closeMenuAuthModal, setTrue: openMenuAuthModal }] = useBoolean();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    roleName: createRequiredRule('角色名称不能为空'),
    status: defaultRequiredRule
  };

  useEffect(() => {
    if (open) {
      // 新增时初始化默认值
      if (operateType === 'add') {
        form.setFieldsValue({
          status: EnableStatus.ENABLED
        });
        // 新增模式：清空原始编码
        setInitialRoleCode('');
      } else {
        // 编辑时缓存初始角色编码
        const roleCode = form.getFieldValue('roleCode');
        setInitialRoleCode(roleCode);
      }
    }
  }, [form, operateType, open]);

  // 角色编码校验规则
  const roleCodeRules = getRoleCodeRules(initialRoleCode, operateType);

  return (
    <ADrawer
      open={open}
      title={operateType === 'add' ? t('page.manage.role.addRole') : t('page.manage.role.editRole')}
      footer={
        <AFlex justify="space-between">
          <AButton onClick={onClose}>{t('common.cancel')}</AButton>
          <AButton
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </AButton>
        </AFlex>
      }
      onClose={onClose}
    >
      <AForm
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        {/* 添加 roleId 隐藏字段（核心修改） */}
        <AForm.Item
          noStyle
          name="roleId"
        >
          <AInput type="hidden" />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.role.roleName')}
          name="roleName"
          rules={[rules.roleName]}
        >
          <AInput placeholder={t('page.manage.role.form.roleName')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.role.roleCode')}
          name="roleCode"
          rules={roleCodeRules}
        >
          <AInput placeholder={t('page.manage.role.form.roleCode')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.role.roleStatus')}
          name="status"
        >
          <ARadio.Group>
            {enableStatusOptions.map(item => (
              <ARadio
                key={item.value}
                value={item.value}
              >
                {t(item.label)}
              </ARadio>
            ))}
          </ARadio.Group>
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.role.roleDesc')}
          name="roleDesc"
        >
          <AInput placeholder={t('page.manage.role.form.roleDesc')} />
        </AForm.Item>
      </AForm>

      {operateType === 'edit' && (
        <ASpace>
          <AButton onClick={openMenuAuthModal}>{t('page.manage.role.menuAuth')}</AButton>
          <MenuAuthModal
            open={menuAuthVisible}
            roleId={rowId}
            onClose={closeMenuAuthModal}
          />

          <AButton onClick={openButtonAuthModal}>{t('page.manage.role.buttonAuth')}</AButton>
          <ButtonAuthModal
            open={buttonAuthVisible}
            roleId={rowId}
            onClose={closeButtonAuthModal}
          />
        </ASpace>
      )}
    </ADrawer>
  );
});

export default RoleOperateDrawer;
