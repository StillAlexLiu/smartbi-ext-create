import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import { createRequire } from 'node:module';

import { create } from './commands/create';
import type { CreateOptions } from './types';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const DEFAULT_VUE_MODULE_REPO = 'https://git.alexcharts.top:7443/smartbi/vue-ext/smartbi-ext-build-tool.git';
const DEFAULT_VUE_MODULE_BRANCH = 'main';

const program = new Command();

program
  .name('smartbi')
  .description('SmartBI 扩展开发脚手架工具')
  .version(
    chalk.cyan(figlet.textSync('smartbi', { horizontalLayout: 'full' })) +
      '\n' +
      chalk.gray(`v${version}`),
    '-v, --version',
    '输出当前版本号'
  );

program
  .command('create <project-name>')
  .description('创建一个新的 SmartBI 扩展项目')
  .option('-f, --force', '目标目录存在时强制覆盖')
  .option('-y, --default', '跳过交互，使用默认配置（生成所有可选文件）')
  .option('-C, --cwd <path>', '指定生成的父目录（默认当前工作目录）')
  .option('--alias <name>', '扩展别名')
  .option('--desc <text>', '扩展描述')
  .option('--no-application-context', '不生成 applicationContext.xml')
  .option('--no-portlet', '不生成 portlet.xml')
  .option('--no-configuration-patch', '不生成 ConfigurationPatch.js')
  .option('--vue-module', '生成 src/vue 前端新模块扩展（从 Git 私有仓库拉取代码）')
  .option('--no-vue-module', '不添加 Vue 前端新模块扩展')
  .option('--vue-module-repo <url>', `Vue 模块私有 Git 仓库地址（默认 ${DEFAULT_VUE_MODULE_REPO}）`, DEFAULT_VUE_MODULE_REPO)
  .option('--vue-module-branch <branch>', `Vue 模块 Git 分支（默认 ${DEFAULT_VUE_MODULE_BRANCH}）`, DEFAULT_VUE_MODULE_BRANCH)
  .action((projectName: string, options: CreateOptions) => {
    create(projectName, options).catch((err) => {
      console.error(chalk.red('\n创建项目失败：'), (err as Error).message);
      process.exit(1);
    });
  });

program.on('--help', () => {
  console.log('');
  console.log(chalk.cyan('  示例：'));
  console.log('');
  console.log(chalk.gray('    # 交互式创建项目'));
  console.log('    $ smartbi create my-ext');
  console.log('');
  console.log(chalk.gray('    # 使用默认配置快速创建（生成所有可选文件，包含 Vue 模块）'));
  console.log('    $ smartbi create my-ext -y');
  console.log('');
  console.log(chalk.gray('    # 强制覆盖已存在的目录'));
  console.log('    $ smartbi create my-ext -f');
  console.log('');
  console.log(chalk.gray('    # 跳过部分可选文件，不生成 Vue 模块'));
  console.log('    $ smartbi create my-ext --no-portlet --no-vue-module');
  console.log('');
  console.log(chalk.gray('    # 指定别名和描述（跳过对应交互）'));
  console.log('    $ smartbi create my-ext --alias "我的扩展" --desc "自定义业务扩展"');
  console.log('');
  console.log(chalk.gray('    # 指定 Vue 模块来源仓库地址与分支'));
  console.log('    $ smartbi create my-ext --vue-module --vue-module-branch develop');
  console.log('');
});

program.parse(process.argv);
