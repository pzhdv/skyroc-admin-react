import { combineSlices, configureStore } from '@reduxjs/toolkit';
import type { Action, ThunkAction } from '@reduxjs/toolkit';

// 导入业务切片
import { authSlice } from '../features/auth/authStore';
import { routeSlice } from '../features/router/routeStore';
import { tabSlice } from '../features/tab/tabStore';
import { themeSlice } from '../features/theme';
import { appSlice } from '../layouts/appStore';

/** 自动合并多个切片的 reducer（RTK 官方推荐方式） 内部会根据每个 slice 的 reducerPath 自动组合 */
const rootReducer = combineSlices(appSlice, authSlice, themeSlice, routeSlice, tabSlice);

/** 全局状态类型（从根 reducer 自动推导，无需手动定义） */
export type RootState = ReturnType<typeof rootReducer>;

/** 创建 Redux 仓库 */
export const store = configureStore({
  reducer: rootReducer
});

// 自动推导出仓库、dispatch、thunk 类型
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
