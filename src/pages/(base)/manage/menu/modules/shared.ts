const LAYOUT_PREFIX = 'layout.';
const VIEW_PREFIX = 'view.';
const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$';

export function createDefaultModel(): Model {
  return {
    activeMenu: undefined,
    // buttons: [],
    component: undefined,
    constant: false,
    fixedIndexInTab: undefined,
    hideInMenu: false,
    href: '',
    i18nKey: '',
    icon: '',
    iconType: 1,
    keepAlive: false,
    layout: 'base',
    menuName: '',
    menuType: 1,
    multiTab: false,
    order: 1,
    page: '',
    parentId: 0,
    pathParam: '',
    query: '',
    routeName: '',
    routePath: '',
    status: 1
  };
}

export function getLayoutAndPage(component?: string | null) {
  let layout = '';
  let page = '';

  const [layoutOrPage = '', pageItem = ''] = component?.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT) || [];

  layout = getLayout(layoutOrPage);
  page = getPage(pageItem || layoutOrPage);

  return { layout, page };
}

function getLayout(layout: string) {
  return layout.startsWith(LAYOUT_PREFIX) ? layout.replace(LAYOUT_PREFIX, '') : '';
}

function getPage(page: string) {
  return page.startsWith(VIEW_PREFIX) ? page.replace(VIEW_PREFIX, '') : '';
}

/**
 * 提取路由模板中的参数占位符（如:pid、:id）
 *
 * @param {string} routePath - 路由模板（如/projects/:pid/edit/:id）
 */
export function extractRouteParamsFromTemplate(routePath: string) {
  // 正则匹配:xxx 格式的参数，捕获xxx部分
  const paramRegex = /:([a-zA-Z0-9_]+)/g;
  const params = [];
  let match;
  // 循环匹配所有参数
  while ((match = paramRegex.exec(routePath)) !== null) {
    params.push(match[1]); // match[1] 是捕获的参数名（如pid、id）
  }
  return {
    param: params.join(','),
    path: routePath
  };
}

export function flattenMenu(menuList: Api.SystemManage.SysMenu[]) {
  const result: CommonType.Option<number>[] = [];

  function flatten(item: Api.SystemManage.SysMenu) {
    const label = item.menuName;

    result.push({ label, value: item.menuId }); // 将当前元素加入结果数组，并移除 children 属性

    if (item.children && Array.isArray(item.children)) item.children.forEach(flatten); // 递归处理 children
  }

  menuList.forEach(flatten); // 对初始数组中的每一个元素进行展开

  return result;
}

export type Model = Pick<
  Api.SystemManage.SysMenu,
  | 'activeMenu'
  | 'component'
  | 'constant'
  | 'fixedIndexInTab'
  | 'hideInMenu'
  | 'href'
  | 'i18nKey'
  | 'icon'
  | 'iconType'
  | 'keepAlive'
  | 'menuName'
  | 'menuType'
  | 'multiTab'
  | 'order'
  | 'parentId'
  | 'routeName'
  | 'routePath'
  | 'status'
> & {
  // buttons: NonNullable<Api.SystemManage.SysMenu['buttons']>;
  layout: string;
  page: string;
  pathParam: string;
  query: NonNullable<Api.SystemManage.SysMenu['query']>;
};

export type OperateType = AntDesign.TableOperateType | 'addChild';

export type Props = Omit<Page.OperateDrawerProps, ' operateType'> & {
  allPages: string[];
  menuList: CommonType.Option<number>[];
  operateType: OperateType;
};

export type RuleKey = Extract<keyof Model, 'menuName' | 'routeName' | 'routePath'>;
