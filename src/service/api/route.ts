import { request } from '../request';
import { ROUTE_URLS } from '../urls';

/** get constant routes */
export function fetchGetConstantRoutes() {
  return request<Api.Route.MenuRoute[]>({ url: ROUTE_URLS.GET_CONSTANT_ROUTES });
}

/** get backend routes (完整路由结构) */
export function fetchGetBackendRoutes() {
  return request<Api.Route.BackendRouteResponse>({ url: ROUTE_URLS.GET_USER_ROUTES });
}

/** get user routes */
export function fetchGetVueUserRoutes() {
  return request<Api.Route.UserRoute>({ url: '/route/getUserRoutes' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ params: { routeName }, url: ROUTE_URLS.IS_ROUTE_EXIST });
}
