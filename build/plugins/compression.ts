import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import viteCompression from 'vite-plugin-compression';

/**
 * 根据环境配置压缩插件和打包分析插件
 *
 * @param viteEnv - Vite环境变量对象，包含构建模式等信息
 * @returns 插件配置数组，仅在生产环境包含压缩和分析插件
 */
export function setupCompression(mode: string) {
  // 仅在生产环境启用压缩和打包分析（避免影响开发环境构建速度）
  const isProduction = mode === 'prod';

  const plugins: PluginOption[] = [
    // Brotli 压缩 生产环境启用
    isProduction &&
      viteCompression({
        // 压缩算法：使用Node.js zlib模块的brotliCompress方法（比gzip压缩率更高）
        algorithm: 'brotliCompress',
        // 是否删除源文件：生产环境建议保留源文件，避免部分服务器不支持压缩文件时无法访问
        deleteOriginFile: false,
        // 生成的压缩文件后缀
        ext: '.br',
        // 压缩阈值：大于10kb的文件才压缩（小文件压缩收益有限）
        threshold: 10240,
        // 控制台输出压缩结果（方便查看压缩效果）
        verbose: true
      }),

    // Gzip 压缩配置 生产环境启用
    isProduction &&
      viteCompression({
        // 压缩算法：使用Node.js zlib模块的gzip方法（兼容性更广泛）
        algorithm: 'gzip',
        // 是否删除源文件：生产环境建议保留源文件，作为压缩文件的降级方案
        deleteOriginFile: false,
        // 生成的压缩文件后缀
        ext: '.gz',
        // 压缩阈值：大于10kb的文件才压缩
        threshold: 10240,
        // 控制台输出压缩结果
        verbose: true
      }),

    // 打包体积分析插件 生产环境启用
    isProduction &&
      visualizer({
        // 是否显示brotli压缩后的大小：需先通过vite-plugin-compression生成.br文件
        brotliSize: true,
        // 生成的报告文件名（输出到构建目录）
        filename: 'report.html',
        // 是否显示gzip压缩后的大小：需先通过vite-plugin-compression生成.gz文件
        gzipSize: true,
        // 构建完成后是否自动在浏览器打开报告（生产环境构建后生效）
        open: true,
        // 是否包含sourcemap分析：关闭以减少分析时间和报告体积
        sourcemap: false,
        // 图表类型：treemap（树状图，直观展示文件大小占比）、sunburst（旭日图）、network（依赖网络图）等
        template: 'treemap',
        // 报告标题
        title: 'Bundle Analysis'
      })
  ].filter(Boolean); // 过滤掉环境判断为false的项

  return plugins;
}
