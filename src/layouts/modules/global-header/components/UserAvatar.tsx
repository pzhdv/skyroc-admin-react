import { Avatar, type MenuProps } from 'antd';

import { selectToken } from '@/features/auth/authStore';
import { useRoute, useRouter } from '@/features/router';
import { useUserInfo } from '@/service/hooks';

const UserAvatar = memo(() => {
  const token = useAppSelector(selectToken);

  const { data: userInfo } = useUserInfo();

  const { t } = useTranslation();

  const { navigate, push } = useRouter();

  const { fullPath } = useRoute();

  function logout() {
    window?.$modal?.confirm({
      cancelText: t('common.cancel'),
      content: t('common.logoutConfirm'),
      okText: t('common.confirm'),
      onOk: () => {
        push('/login-out', { query: { redirect: fullPath } });
      },
      title: t('common.tip')
    });
  }

  function onClick({ key }: { key: string }) {
    if (key === '1') {
      logout();
    } else {
      navigate('/user-center');
    }
  }

  function loginOrRegister() {
    navigate('/login');
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon
            className="text-icon"
            icon="ph:user-circle"
          />
          {t('common.userCenter')}
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: '1',
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon
            className="text-icon"
            icon="ph:sign-out"
          />
          {t('common.logout')}
        </div>
      )
    }
  ];

  return token ? (
    <ADropdown
      menu={{ items, onClick }}
      placement="bottomRight"
      trigger={['click']}
    >
      <div>
        <ASpace>
          {userInfo.avatar ? (
            <Avatar
              alt="avatar"
              className="size-28px"
              src={userInfo.avatar}
            />
          ) : (
            <Avatar className="size-28px">
              <SvgIcon
                className="text-icon-large"
                icon="ph:user-circle"
              />
            </Avatar>
          )}
          <span className="text-16px font-medium">{userInfo.userName}</span>
        </ASpace>
      </div>
    </ADropdown>
  ) : (
    <AButton onClick={loginOrRegister}>{t('page.login.common.loginOrRegister')}</AButton>
  );
});

export default UserAvatar;
