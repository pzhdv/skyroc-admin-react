import json5 from 'json5';

/**
 * 根据当前环境变量创建服务配置 主要作用：解析主接口地址 + 多个其他服务接口地址，生成统一的服务配置
 *
 * @param env - 当前环境变量（从 import.meta.env 读取）
 */
export function createServiceConfig(env: Env.ImportMeta) {
  // 从环境变量中解构主服务地址 和 其他服务地址
  const { VITE_OTHER_SERVICE_BASE_URL, VITE_SERVICE_BASE_URL } = env;

  // 存储其他服务的配置对象（多个后端接口时使用）
  let other = {} as Record<App.Service.OtherBaseURLKey, string>;

  try {
    // 尝试解析环境变量中的 JSON5 格式字符串（支持对象格式）
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch {
    // 解析失败时输出错误提示（格式不正确）
    // eslint-disable-next-line no-console
    console.error('VITE_OTHER_SERVICE_BASE_URL 不是有效的 JSON5 字符串');
  }

  // 基础 HTTP 配置：主服务 baseURL + 其他服务 baseURL
  const httpConfig: App.Service.SimpleServiceConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  };

  // 获取其他服务的所有 key
  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

  // 遍历其他服务，生成每个服务的完整配置（baseURL + 标识 + 代理前缀）
  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map(key => {
    return {
      baseURL: httpConfig.other[key],
      key,
      proxyPattern: createProxyPattern(key)
    };
  });

  // 最终返回的服务配置（主服务 + 其他服务）
  const config: App.Service.ServiceConfig = {
    baseURL: httpConfig.baseURL,
    other: otherConfig,
    proxyPattern: createProxyPattern() // 默认主服务代理前缀
  };

  return config;
}

/**
 * 获取最终使用的接口基础地址 根据是否开启代理，自动切换：真实地址 / 代理前缀
 *
 * @param env - 当前环境变量
 * @param isProxy - 是否开启代理（开发环境开启，生产环境关闭）
 */
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
  // 获取完整服务配置
  const { baseURL, other } = createServiceConfig(env);

  // 存储其他服务的最终地址
  const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>;

  // 遍历其他服务：开启代理 → 使用代理前缀；不开启 → 使用真实地址
  other.forEach(item => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
  });

  return {
    // 主服务：根据代理开关切换真实地址 / 代理前缀
    baseURL: isProxy ? createProxyPattern() : baseURL,
    // 其他服务
    otherBaseURL
  };
}

/**
 * 生成接口代理前缀（用于 Vite 代理） 格式：/proxy-xxx
 *
 * @param key - 服务标识（不传则使用默认主服务）
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  if (!key) {
    // 默认主服务代理前缀
    return '/proxy-default';
  }

  // 其他服务代理前缀
  return `/proxy-${key}`;
}
