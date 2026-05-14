import boxen, { type Options as BoxenOptions } from 'boxen';
import chalk from 'chalk';
import type { Plugin } from 'vite';

import { themeSettings } from '../../src/theme/settings';

// 现代渐变文字欢迎信息
const welcomeMessage = `
${chalk.hex(themeSettings.themeColor)('🚀 欢迎使用 skyroc-admin-react 开源项目')}
${chalk.gray('----------------------------------------------')}
${chalk.magenta('📦 仓库地址')}
${chalk.cyan('https://github.com/pzhdv/skyroc-admin-react')}

${chalk.green('✨ 祝你使用愉快！开发效率提升 100%！')}
`;

const boxenOptions: BoxenOptions = {
  borderColor: themeSettings.themeColor,
  borderStyle: 'round',
  padding: 0.5
};

export function setupProjectInfo(): Plugin {
  return {
    buildStart() {
      console.log(boxen(welcomeMessage, boxenOptions));
    },
    name: 'vite:buildInfo'
  };
}
