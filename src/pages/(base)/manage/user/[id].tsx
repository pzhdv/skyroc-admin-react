import type { DescriptionsProps } from 'antd';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import LookForward from '@/components/LookForward';
import { fetchUserList } from '@/service/api';

type Item<T> = T extends any[] ? T[number] : T;

type ValuesOf<T> = T[keyof T];

type Values = ValuesOf<Api.SystemManage.SystemUser>;

function transformDataToItem<T extends string, U extends Values>(
  tuple: [T, U]
): NonNullable<Item<DescriptionsProps['items']>> {
  const [key, value] = tuple;
  // 空值处理
  if (value === undefined || value === null) {
    return { children: '-', key: key.toString(), label: key };
  }

  // 数组处理
  if (Array.isArray(value)) {
    if (key === 'roleList') {
      const roleList = value as Api.SystemManage.RoleSimple[];
      return {
        children: roleList.length ? roleList.map(r => r.roleName).join('、') : '无',
        key: 'roleList',
        label: 'roleList'
      };
    }
    if (key === 'roleIds') {
      return {
        children: value.length ? value.join('、') : '无',
        key: 'roleIds',
        label: 'roleIds'
      };
    }
    return { children: value.join('、'), key: key.toString(), label: key };
  }

  // 兜底
  return { children: String(value), key: key.toString(), label: key };
}

// 这个页面仅仅是为了展示 react-router-dom 的 loader 的强大能力，数据是随机的对不上很正常
// This page is solely for demonstrating the powerful capabilities of react-router-dom's loader. The data is random and may not match.

const Component = () => {
  const data = useLoaderData() as Api.SystemManage.SystemUser | undefined;

  const { t } = useTranslation();

  if (!data) return <LookForward />;

  const items = Object.entries(data).map(transformDataToItem);

  return (
    <ACard
      className="h-full"
      title="User Info"
    >
      <ADescriptions
        bordered
        items={items}
      />
      <div className="mt-16px text-center text-18px">{t('page.manage.userDetail.explain')}</div>

      <div className="mt-16px text-center text-18px">{t('page.manage.userDetail.content')}</div>
    </ACard>
  );
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const data = await fetchUserList();
    const info = data.records.find(item => String(item.userId) === params.id);
    return info;
  } catch {
    return null;
  }
}

export default Component;
