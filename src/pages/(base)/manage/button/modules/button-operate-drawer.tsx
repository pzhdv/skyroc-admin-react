import { enableStatusOptions } from '@/constants/business';
import { useFormRules } from '@/features/form';
import { EnableStatus } from '@/service/enums';

import { getButtonCodeRules } from './ButtonFormValidate';

type Props = Page.OperateDrawerProps & { buttonId: number; pageSelectOptions: CommonType.Option<number>[] };

type Model = Pick<Api.SystemManage.SysButton, 'buttonCode' | 'buttonName' | 'status'>;

type RuleKey = Exclude<keyof Model, 'buttonCode'>;

const ButtonOperateDrawer: FC<Props> = memo(({ form, handleSubmit, onClose, open, operateType, pageSelectOptions }) => {
  const { t } = useTranslation();

  // 组件挂载时缓存初始值
  const [initialButtonCode, setInitialButtonCode] = useState('');

  const { createRequiredRule, defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    buttonName: createRequiredRule('按钮名称不能为空'),
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
        setInitialButtonCode('');
      } else {
        // 编辑时缓存初始按钮编码
        const buttonCode = form.getFieldValue('buttonCode');
        setInitialButtonCode(buttonCode);
      }
    }
  }, [form, operateType, open]);

  // 按钮编码校验规则
  const buttonCodeRules = getButtonCodeRules(initialButtonCode, operateType);

  return (
    <ADrawer
      open={open}
      title={operateType === 'add' ? t('page.manage.button.addButton') : t('page.manage.button.editButton')}
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
        {/* 添加 buttonId 隐藏字段（核心修改） */}
        <AForm.Item
          noStyle
          name="buttonId"
        >
          <AInput type="hidden" />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.button.selectMenuName')}
          name="menuId"
        >
          <ASelect
            allowClear
            options={pageSelectOptions}
            placeholder={t('page.manage.button.form.selectMenuName')}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.button.buttonCode')}
          name="buttonCode"
          rules={buttonCodeRules}
        >
          <AInput placeholder={t('page.manage.button.form.buttonCode')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.button.buttonName')}
          name="buttonName"
          rules={[rules.buttonName]}
        >
          <AInput placeholder={t('page.manage.button.form.buttonName')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.button.buttonStatus')}
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
      </AForm>
    </ADrawer>
  );
});

export default ButtonOperateDrawer;
