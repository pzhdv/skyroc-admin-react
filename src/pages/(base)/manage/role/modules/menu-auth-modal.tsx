import { SimpleScrollbar } from '@sa/materials';
import type { DataNode } from 'antd/es/tree';
import { useMemo } from 'react';

import { fetchGetMenuIdsAndHomeByRoleId, fetchUpdateRoleMenuAuth } from '@/service/api';
import { useAllPages, useMenuTree } from '@/service/hooks/useSystemManage';

import type { ModulesProps } from './type';

const MenuAuthModal: FC<ModulesProps> = memo(({ onClose, open, roleId }) => {
  const { t } = useTranslation();

  const title = t('common.grant') + t('page.manage.role.menuAuth');

  const { data: allPages = [], isLoading: isLoadingPages } = useAllPages();
  const { data: menuTree = [], isLoading: isLoadingTree } = useMenuTree();

  const [defaultHomePageId, setDefaultHomePageId] = useState<number>();
  const [checks, setChecks] = useState<number[]>([]);

  // 将后端返回的页面列表转换为选项格式
  const pageSelectOptions = useMemo(() => {
    return allPages.map(menu => ({
      label: menu.i18nKey ? t(menu.i18nKey) : menu.menuName,
      value: menu.menuId
    }));
  }, [allPages, t]);

  // 将后端返回的菜单树转换为 Ant Design Tree 需要的格式
  const treeData = useMemo<DataNode[]>(() => {
    function convertMenuTreeToDataNode(menu: Api.Common.TreeVO): DataNode {
      const label = menu.i18nKey ? t(menu.i18nKey) : menu.label;
      return {
        children: menu.children?.map(convertMenuTreeToDataNode),
        key: menu.value,
        title: label
      };
    }

    return menuTree.map(convertMenuTreeToDataNode);
  }, [menuTree, t]);

  async function handleSubmit() {
    // request - 更新角色菜单权限
    const roleMenu: Api.SystemManage.RoleMenuVO = { defaultHomePageId, menuIdList: checks, roleId };
    await fetchUpdateRoleMenuAuth(roleMenu);

    window.$message?.success?.(t('common.grantSuccess'));

    onClose();
  }

  async function init() {
    const data = await fetchGetMenuIdsAndHomeByRoleId(roleId);
    setDefaultHomePageId(data.defaultHomePageId);
    setChecks(data.menuIdList);
  }

  useUpdateEffect(() => {
    if (open) {
      init();
    }
  }, [open]);

  return (
    <AModal
      className="w-480px"
      open={open}
      title={title}
      footer={
        <ASpace className="mt-16px">
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
      onCancel={onClose}
    >
      <div className="flex-y-center gap-16px pb-12px">
        <div>{t('page.manage.menu.home')}</div>

        <ASelect
          className="w-240px"
          loading={isLoadingPages}
          options={pageSelectOptions}
          size="small"
          value={defaultHomePageId}
          onChange={setDefaultHomePageId}
        />
      </div>

      <SimpleScrollbar className="!h-270px">
        {isLoadingTree ? (
          <div className="h-280px flex-center">
            <ASpin />
          </div>
        ) : (
          <ATree
            blockNode
            checkable
            checkedKeys={checks}
            className="h-280px"
            treeData={treeData}
            onCheck={value => setChecks(value as number[])}
          />
        )}
      </SimpleScrollbar>
    </AModal>
  );
});

export default MenuAuthModal;
