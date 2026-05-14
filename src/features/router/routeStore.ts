import type { PayloadAction } from '@reduxjs/toolkit';

import { createAppSlice } from '../../store/createAppSlice';

interface InitialStateType {
  cacheRoutes: string[];
  /** 登录成功后待跳转的路径（路由初始化完成后自动跳转） */
  pendingRedirectPath: string | null;
  removeCacheKey: string[] | string | null;
  routeHomePath: string;
}

const initialState: InitialStateType = {
  /** - 需要进行缓存的页面 */
  cacheRoutes: [],
  /** 登录成功后待跳转的路径（路由初始化完成后自动跳转） */
  pendingRedirectPath: null,
  /** - 需要删除的缓存页面 */
  removeCacheKey: null,
  /** - 首页路由 */
  routeHomePath: import.meta.env.VITE_ROUTE_HOME
};

export const routeSlice = createAppSlice({
  initialState,
  name: 'route',
  reducers: create => ({
    addCacheRoutes: create.reducer((state, { payload }: PayloadAction<string>) => {
      state.cacheRoutes.push(payload);
    }),
    resetRouteStore: create.reducer(() => initialState),
    setCacheRoutes: create.reducer((state, { payload }: PayloadAction<string[]>) => {
      state.cacheRoutes = payload;
    }),
    setHomePath: create.reducer((state, { payload }: PayloadAction<string>) => {
      state.routeHomePath = payload;
    }),

    /** 设置登录后的待跳转路径 */
    setPendingRedirectPath: create.reducer((state, { payload }: PayloadAction<string | null>) => {
      state.pendingRedirectPath = payload;
    }),
    setRemoveCacheKey: create.reducer((state, { payload }: PayloadAction<InitialStateType['removeCacheKey']>) => {
      state.removeCacheKey = payload;
    })
  }),
  selectors: {
    selectCacheRoutes: route => route.cacheRoutes,
    selectPendingRedirectPath: route => route.pendingRedirectPath,
    selectRemoveCacheKey: route => route.removeCacheKey,
    selectRouteHomePath: route => route.routeHomePath
  }
});

export const {
  addCacheRoutes,
  resetRouteStore,
  setCacheRoutes,
  setHomePath,
  setPendingRedirectPath,
  setRemoveCacheKey
} = routeSlice.actions;

export const { selectCacheRoutes, selectPendingRedirectPath, selectRemoveCacheKey, selectRouteHomePath } =
  routeSlice.selectors;
