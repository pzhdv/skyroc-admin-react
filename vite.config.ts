import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';

import { defineConfig, loadEnv } from 'vite';

import { createViteProxy, getBuildTime } from './build/config';
import { setupVitePlugins } from './build/plugins';

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  const buildTime = getBuildTime();

  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview;
  return {
    base: viteEnv.VITE_BASE_URL,
    build: {
      rollupOptions: {
        output: {
          assetFileNames: chunkInfo => {
            const name = chunkInfo.names[0];

            if (name?.endsWith('.css')) {
              return 'css/[name]-[hash].css';
            }

            const imgExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

            if (imgExts.some(ext => name?.endsWith(`.${ext}`))) {
              return 'images/[name]-[hash].[ext]';
            }

            if (name?.endsWith('.js')) {
              return 'js/[name]-[hash].js';
            }

            return 'assets/[name]-[hash].[ext]';
          },
          chunkFileNames: chunkInfo => {
            // 检查文件路径，如果是 pages 目录下的文件，则修改文件名和路径
            const filePath = chunkInfo.facadeModuleId;

            if (filePath) {
              // 提取文件的父文件夹作为文件名
              if (filePath.includes('/src/pages/')) {
                // 提取文件的父文件夹作为文件名
                const pageName = filePath.split('/src/pages/')[1];
                // 替换 [name] 为  name 因为vite不支持
                const newPath = pageName.replace(/\[([^\]]+)\]/g, '$1');

                const path = newPath.slice(0, newPath.lastIndexOf('/'));

                return `js/pages/${path}/[name]-[hash].js`;
              } else if (filePath.includes('/src/components/')) {
                return `js/components/[name]-[hash].js`;
              }
            }

            return 'js/[name]-[hash].js'; // 默认处理方式
          },
          // 手动代码分割配置
          // 作用：将第三方依赖包进行精细化拆分打包，优化浏览器缓存和首屏加载速度
          // 被修改频率低的基础库单独打包，发布新版本时只需更新业务代码，依赖包缓存可长期有效
          manualChunks: {
            // 动画库：framer-motion 单独分包
            animate: ['motion'],
            // 组件库：Ant Design 核心库 + React19 兼容补丁
            antd: ['antd', '@ant-design/v5-patch-for-react-19'],
            // 请求库：Axios 网络请求工具
            axios: ['axios'],
            // 国际化：i18n 多语言核心依赖
            il8n: ['react-i18next', 'i18next'],
            // React 核心全家桶：框架本体 + DOM 渲染 + 错误边界处理
            react: ['react', 'react-dom', 'react-error-boundary'],
            // 路由库：React 路由核心模块
            reactRouter: ['react-router-dom'],
            // 状态管理：Redux 工具集 + React 绑定
            redux: ['react-redux', '@reduxjs/toolkit'],
            // 项目内部通用工具库：@sa 系列封装模块（请求、颜色、hooks、物料、工具函数）
            sa: ['@sa/axios', '@sa/color', '@sa/hooks', '@sa/materials', '@sa/utils']
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/scss/global.scss" as *;`,
          api: 'modern-compiler'
        }
      }
    },
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    plugins: setupVitePlugins(viteEnv, buildTime, configEnv.mode),
    preview: {
      port: 9725
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      open: true,
      port: 9527,
      proxy: createViteProxy(viteEnv, enableProxy),
      warmup: {
        clientFiles: ['./index.html', './src/{pages,components}/*']
      }
    }
  };
});
