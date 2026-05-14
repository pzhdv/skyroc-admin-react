import { useLoading } from '@sa/hooks';
import type { DescriptionsProps } from 'antd';

import buttonAuthCode from '@/constants/btn-auth-code';
import { useInitAuth } from '@/features/auth/auth';
import { useRouter } from '@/features/router';
import { useUserInfo } from '@/service/hooks';

type AccountKey = 'admin' | 'super' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  password: string;
  userName: string;
}

const ToggleAuth = () => {
  const { t } = useTranslation();

  const { data: userInfo } = useUserInfo();

  const { toLogin } = useInitAuth();

  const { loading, startLoading } = useLoading();

  const { reload, resetRoutes } = useRouter();

  const [loginAccount, setLoginAccount] = useState<AccountKey>('super');

  const accounts: Account[] = [
    {
      key: 'super',
      label: t('page.login.pwdLogin.superAdmin'),
      password: 'pzh18785384970@',
      userName: 'super'
    },
    {
      key: 'admin',
      label: t('page.login.pwdLogin.admin'),
      password: 'pzh18785384970@',
      userName: 'admin'
    },
    {
      key: 'user',
      label: t('page.login.pwdLogin.user'),
      password: 'pzh18785384970@',
      userName: 'user'
    }
  ];

  const roles: DescriptionsProps['items'] = [
    {
      children: <ASpace>{userInfo?.roles.map(role => <ATag key={role}>{role}</ATag>)}</ASpace>,
      key: '1',
      label: t('page.manage.user.userRole')
    },
    {
      children: (
        <ASpace>
          {accounts.map(account => (
            <AButton
              disabled={loading && loginAccount !== account.key}
              key={account.key}
              loading={loading && loginAccount === account.key}
              onClick={() => handleToggleAccount(account)}
            >
              {account.label}
            </AButton>
          ))}
        </ASpace>
      ),
      key: '2',
      label: t('page.function.toggleAuth.toggleAccount')
    }
  ];

  async function handleToggleAccount(account: Account) {
    setLoginAccount(account.key);

    startLoading();

    resetRoutes();

    await toLogin({ password: account.password, userName: account.userName }, false);

    setTimeout(() => {
      reload();
    }, 500); // 模拟网络请求延迟，确保路由重置后再重新加载页面
  }
  return (
    <ASpace
      className="w-full"
      direction="vertical"
      size={16}
    >
      <ACard
        className="card-wrapper"
        size="small"
        title={t('request.logout')}
      >
        <ADescriptions
          bordered
          column={1}
          items={roles}
          layout="vertical"
          size="small"
        />

        <ACard
          className="card-wrapper"
          size="small"
          title={t('page.function.toggleAuth.authHook')}
          variant="borderless"
        >
          <div className="my-2">
            <ASpace>
              <span>这里有三个按钮</span>
              <span>{t('page.function.toggleAuth.superAdminVisible')}</span>
              <span>{t('page.function.toggleAuth.adminVisible')}</span>
              <span>{t('page.function.toggleAuth.adminOrUserVisible')}</span>
            </ASpace>
          </div>
          <ASpace>
            <AuthBtn auth={buttonAuthCode.function.auth.super.view}>
              {t('page.function.toggleAuth.superAdminVisible')}
            </AuthBtn>
            <AuthBtn auth={buttonAuthCode.function.auth.admin.view}>
              {t('page.function.toggleAuth.adminVisible')}
            </AuthBtn>
            <AuthBtn auth={buttonAuthCode.function.auth.user.view}>
              {t('page.function.toggleAuth.adminOrUserVisible')}
            </AuthBtn>
          </ASpace>
        </ACard>
      </ACard>
    </ASpace>
  );
};

export default ToggleAuth;
