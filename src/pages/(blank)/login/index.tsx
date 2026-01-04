import { loginModuleRecord } from '@/constants/app';
import { useInitAuth } from '@/features/auth/auth';
import { useFormRules } from '@/features/form';


interface ILogin {
  password: string;
  userName: string;
  remember: boolean;
}

type LoginParams = Pick<ILogin, 'password' | 'userName'|'remember'>;

const INITIAL_VALUES = {
  password: 'pzh18785384970@',
  remember: true,
  userName: 'admin'
};

const PwdLogin = () => {
  const { t } = useTranslation();

  const { loading, toLogin } = useInitAuth();

  const [form] = AForm.useForm<LoginParams>();

  const navigate = useNavigate();

  const {
    formRules: { pwd, userName: userNameRules }
  } = useFormRules();


  function goCodeLogin() {
    navigate('code-login');
  }

  function goRegister() {
    navigate('register');
  }

  function goResetPwd() {
    navigate('reset-pwd');
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">{t('page.login.pwdLogin.title')}</h3>
      <AForm
        className="pt-24px"
        form={form}
        initialValues={INITIAL_VALUES}
        onFinish={toLogin}
      >
        <AForm.Item
          name="userName"
          rules={userNameRules}
        >
          <AInput />
        </AForm.Item>

        <AForm.Item
          name="password"
          rules={pwd}
        >
          <AInput.Password autoComplete="password" />
        </AForm.Item>

         <AForm.Item>
          <AFlex
            align="center"
            justify="space-between"
          >
            <AForm.Item
              noStyle
              name="remember"
              valuePropName="checked"
            >
              <ACheckbox>{t('page.login.pwdLogin.rememberMe')}</ACheckbox>
            </AForm.Item>
            <AButton
              type="link"
              onClick={goResetPwd}
            >
              {t('page.login.pwdLogin.forgetPassword')}
            </AButton>
          </AFlex>
        </AForm.Item>

        <ASpace
          className="w-full"
          direction="vertical"
          size={24}
        >
          <AButton
            block
            color="primary"
            htmlType="submit"
            loading={loading}
            shape="round"
            size="large"
            type="primary"
          >
            {t('common.confirm')}
          </AButton>
          <div className="flex-y-center justify-between gap-12px">
            <AButton
              block
              className="flex-1"
              onClick={goCodeLogin}
            >
              {t(loginModuleRecord['code-login'])}
            </AButton>
            <AButton
              block
              className="flex-1"
              onClick={goRegister}
            >
              {t(loginModuleRecord.register)}
            </AButton>
          </div>
        </ASpace>
      </AForm>
    </>
  );
};

export default PwdLogin;
