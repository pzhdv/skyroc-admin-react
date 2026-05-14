import { useTable, useTableOperate, useTableScroll } from '@/features/table';
import {
  fetchGetButtonsByRoleId,
  fetchGetSysButtonListWrapper,
  fetchUpdateRoleButtonAuth
} from '@/service/api/system-manage';
import { useAllPages } from '@/service/hooks/useSystemManage';

import TopSearch from './button-top-search';
import type { ModulesProps } from './type';

const ButtonAuthModal: FC<ModulesProps> = memo(({ onClose, open, roleId }) => {
  const { t } = useTranslation();

  const title = t('common.grant') + t('page.manage.role.buttonAuth');

  // 获取所有菜单页面数据
  const { data: allPages = [] } = useAllPages();
  // 将后端返回的页面列表转换为选项格式
  const pageSelectOptions = useMemo(() => {
    return allPages
      .filter(menu => !menu.href) // 过滤：只保留没有 href 的菜单（排除外链，外链不需要按钮）
      .filter(menu => !menu.routePath?.includes('/exception/')) // 新增：排除 routePath 包含 /exception/ 的菜单
      .map(menu => ({
        label: menu.i18nKey ? t(menu.i18nKey) : menu.menuName,
        value: menu.menuId
      }));
  }, [allPages, t]);

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { data, run, searchProps, tableProps } = useTable({
    apiFn: fetchGetSysButtonListWrapper,
    // ⚠️ 重点：API 请求参数定义
    // 注意：
    // 1. 如果要在搜索表单中使用这些参数，必须在这里定义
    // 2. 可选参数必须设置为 null，不能是 undefined
    // 3. 不能是 undefined，否则表单字段将不是响应式的
    apiParams: {
      current: 1,
      menuId: null,
      size: 10
    },
    columns: () => [
      {
        align: 'center',
        dataIndex: 'index',
        key: 'index',
        title: t('common.index'),
        width: 50
      },

      {
        align: 'center',
        dataIndex: 'menuName',
        key: 'menuName',
        render: (_, record) => {
          const label = record.menuI18nKey ? t(record.menuI18nKey) : record.menuName;
          return label;
        },
        // width: 80,
        title: t('page.manage.button.selectMenuName')
      },
      {
        align: 'center',
        dataIndex: 'buttonCode',
        key: 'buttonCode',
        // width: 80,
        title: t('page.manage.button.buttonCode')
      },
      {
        align: 'center',
        dataIndex: 'buttonName',
        key: 'buttonName',
        // width: 80,
        title: t('page.manage.button.buttonName')
      }
    ],
    isChangeURL: false,
    pagination: {
      hideOnSinglePage: true
    },
    rowKey: 'buttonId' // 是否同步 URL 参数（可选） false: 不同步，true: 同步到 URL
  });

  const { checkedRowKeys, onSelectChange, rowSelection } = useTableOperate({
    data,
    // 添加成功 返回true 【添加失败 返回false 不关闭抽屉】
    executeResActions: async (newData, type) => {
      // 操作结果标识
      const isSuccess = true;

      return isSuccess;
    },
    getData: run,
    rowKey: 'buttonId' // 行唯一标识(ID)
  });

  // 获取已授权的按钮ID列表
  async function getChecks() {
    const response = await fetchGetButtonsByRoleId(roleId);
    const buttonIdList = response.buttonIdList || [];
    onSelectChange(buttonIdList);
  }

  // 提交更新角色按钮权限
  async function handleSubmit() {
    // request - 更新角色按钮权限
    const roleMenu: Api.SystemManage.RoleButtonVO = { buttonIdList: checkedRowKeys, roleId };
    await fetchUpdateRoleButtonAuth(roleMenu);

    window.$message?.success?.(t('common.grantSuccess'));

    onClose();
  }

  // 弹窗关闭时重置搜索表单
  useUpdateEffect(() => {
    if (open) {
      searchProps.reset(); // 重置搜索表单
      getChecks();
    } else {
      onSelectChange([]); // 关闭抽屉时清空选中状态
    }
  }, [open]);

  return (
    <AModal
      open={open}
      title={title}
      width={800}
      footer={
        <ASpace className="mt-0">
          <AButton
            size="small"
            onClick={onClose}
          >
            {t('common.cancel')}
          </AButton>
          <AButton
            size="small"
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </AButton>
        </ASpace>
      }
      styles={{
        body: { height: '60vh' }
      }}
      onCancel={onClose}
    >
      <ACard
        className="card-wrapper"
        ref={tableWrapperRef}
        styles={{ body: { display: 'flex', flexDirection: 'column', height: '60vh' } }}
      >
        <TopSearch
          {...searchProps}
          pageSelectOptions={pageSelectOptions}
        />
        <ATable
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />
      </ACard>
    </AModal>
  );
});

export default ButtonAuthModal;
