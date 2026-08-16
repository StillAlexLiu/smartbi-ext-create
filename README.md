# smartbi 扩展脚手架

> SmartBI 扩展项目开发脚手架工具。通过一行命令快速生成符合 SmartBI 扩展规范的 Java + Eclipse + Ant 风格项目骨架，开箱即用，支持 `ant dist` 直接打包 `.ext` 文件。

[![CI][ci-badge]][ci-url]
[![npm version][npm-version-badge]][npm-url]
[![npm downloads][npm-downloads-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

---

## ✨ 功能特性

- 🔧 **零配置生成**：一条命令生成完整的 SmartBI 扩展项目目录结构与配置文件
- 🌐 **国际化内置**：默认生成简中、繁中、英文 3 套 `extension_lang_*.properties`
- 🛡️ **XML 安全注入防护**：用户输入自动转义，杜绝 XML 注入
- 🎨 **交互式输入**：支持别名、描述、可选文件按需生成，也支持 `-y` 跳过所有交互
- ⚠️ **安全覆盖**：目录已存在时会提示确认；`-f/--force` 可强制覆盖
- 📦 **开箱即用的 Ant 构建**：`build.xml` 包含 `clean / init / compile / jar / dist` 全目标
- 🛠️ **Eclipse 项目配置**：`.project`、`.classpath`、`WEB-INF/web.xml` 就绪，直接 `File → Import`
- 🚀 **tsdown 极速构建**：基于 Rolldown + Oxc，构建速度比传统方案快数倍
- 🤖 **CI/CD 就绪**：GitHub Actions 已配置类型检查、构建、冒烟测试及 provenance 发布

---

## 🚀 快速开始

### 环境要求

- **Node.js ≥ 22.0.0**（tsdown 0.22+ / Rolldown / `unrun` 依赖该版本，npm 在该版本会正确拉取平台原生二进制）
- **JDK 8+**（生成后编译扩展项目需要）
- **Ant**（可选，SmartBI 扩展打包使用）

### 方式一：通过 `npx` 直接使用（推荐）

```bash
npx smartbi create <项目名称>
```

例如：

```bash
npx smartbi create my-smartbi-ext
```

### 方式二：全局安装

```bash
npm install -g smartbi

smartbi create my-smartbi-ext
```

### 方式三：本地开发

```bash
git clone <your-repo-url> smartbi-ext-create
cd smartbi-ext-create
npm install
npm run build
npm start -- create my-smartbi-ext
```

---

## 📖 使用说明

### 命令语法

```bash
smartbi create <project-name> [options]
```

### 参数与选项

| 选项 | 别名 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `<project-name>` | - | **必填**，项目名称，会在当前目录下创建同名子目录 | - |
| `--alias <name>` | - | 扩展别名（`extension.xml` 的 `alias` 属性） | 与项目名相同 |
| `--desc <text>` | - | 扩展描述（`extension.xml` 的 `desc` 属性） | 与项目名相同 |
| `-C, --cwd <path>` | - | 指定生成的父目录路径 | 当前工作目录 `process.cwd()` |
| `-f, --force` | - | 如果目标目录已存在，强制覆盖（无需交互确认） | `false` |
| `-y, --default` | - | 跳过所有交互，使用默认值生成所有可选文件 | `false` |
| `--no-application-context` | - | 不生成 `applicationContext.xml`（Spring 配置） | 默认生成 |
| `--no-portlet` | - | 不生成 `portlet.xml`（Portlet 配置示例） | 默认生成 |
| `--no-configuration-patch` | - | 不生成 `ConfigurationPatch.js`（前端扩展点） | 默认生成 |
| `-h, --help` | - | 查看命令帮助 | - |
| `-v, --version` | - | 查看版本号（带 figlet 艺术字 banner） | - |

### 交互式示例

```bash
$ npx smartbi create my-first-ext

🚀 Smartbi 扩展项目脚手架

? 扩展别名 (alias): my-first-ext
? 扩展描述 (desc): 我的第一个 SmartBI 扩展
? 生成 applicationContext.xml (Spring 配置)? Yes
? 生成 portlet.xml (Portlet 配置示例)? Yes
? 生成 ConfigurationPatch.js (前端扩展点)? Yes

⠋ 正在创建项目结构...
✔ 项目创建完成！

🎉 Smartbi 扩展项目创建成功！
  项目路径：/Users/you/work/my-first-ext

  目录结构：
    - lib-compile/
    - src/java/
    - src/web/WEB-INF/
    - src/web/META-INF/
    - src/web/META-INF/classes/
    - src/web/META-INF/lib/
    - src/web/vision/
    - src/web/vision/css/
    - src/web/vision/img/
    - src/web/vision/js/
    - src/web/vision/js/ext/

  主要文件：
    - extension.xml           扩展配置
    - build.xml               Ant 构建脚本
    - .project / .classpath   Eclipse 项目配置
    - applicationContext.xml  Spring 配置
    - portlet.xml             Portlet 配置
    - ConfigurationPatch.js   JS 扩展点

  下一步：导入 Eclipse 或直接使用 Ant 执行 dist 目标打包 .ext 文件
```

### 一条命令直接生成（无交互）

```bash
npx smartbi create my-ext \
  --alias "报表工具扩展" \
  --desc "企业级报表工具集" \
  -y -f
```

---

## 📁 生成的项目结构

```
my-smartbi-ext/
├── .classpath                              # Eclipse 类路径配置
├── .gitignore                              # Git 忽略规则
├── .project                                # Eclipse 工程描述
├── build.xml                               # Ant 构建脚本（clean/init/compile/jar/dist）
├── lib-compile/                            # 编译时依赖目录
└── src/
    ├── java/                               # Java 源码目录
    └── web/
        ├── WEB-INF/
        │   └── web.xml                     # Web 应用描述符（含 SmartBI CoreServlet）
        ├── META-INF/
        │   ├── extension.xml               # 🔑 扩展核心配置
        │   ├── extension_lang_en.properties# 英文国际化
        │   ├── extension_lang_zh_CN.properties # 简体中文国际化
        │   ├── extension_lang_zh_TW.properties # 繁体中文国际化
        │   ├── applicationContext.xml      # 📦 Spring/RMIModule 配置（可选）
        │   ├── portlet.xml                 # 📦 Portlet 配置示例（可选）
        │   ├── classes/                    # 编译 class 文件目录
        │   └── lib/                        # 第三方 Jar 包目录
        └── vision/
            ├── css/
            ├── img/
            └── js/
                └── ext/
                    └── ConfigurationPatch.js # 📦 前端扩展点（可选）
```

### 打包扩展

```bash
cd my-smartbi-ext
ant dist
```

执行完成后在 `dist/` 目录生成 `my-smartbi-ext.ext`，部署到 SmartBI 即可。

---

## 🛠️ 开发（贡献者）

### 技术栈

| 模块 | 技术 | 说明 |
| --- | --- | --- |
| 语言 | TypeScript 5 | 强类型，tsdown 自动生成 `.d.ts` 声明 |
| 构建 | **tsdown** 0.22+ | 基于 Rolldown + Oxc 的极速库打包工具 |
| CLI | Commander 11 | 命令解析与子命令注册 |
| 交互 | Inquirer 9 | 交互式问答提示 |
| 视觉 | Chalk / Ora / Figlet | 彩色输出 / Loading Spinner / Banner ASCII 艺术字 |
| 文件 | fs-extra 11 | 跨平台目录与文件操作 |
| CI/CD | GitHub Actions | `npm-publish.yml` 统一：typecheck + build + tarball/bin 校验 + CLI 冒烟 + npm publish 跳过重复版本 |

### 本地开发命令

```bash
# 安装依赖
npm install

# 类型检查
npm run typecheck

# 构建（tsdown 加载 tsdown.config.ts，生成 dist/cli.js + dist/index.js + 类型声明 + 分片 chunk）
npm run build

# 监听模式（增量构建）
npm run dev

# 本地运行 CLI（需要先 build）
npm start -- create my-ext -y -f

# 全局链接（可在本机使用 `smartbi` 命令）
npm link
smartbi --version

# 预发布 dry-run
npm publish --dry-run
```

### 构建产物（`dist/`）

```
dist/
├── cli.js       # CLI 入口，带 #!/usr/bin/env node shebang，作为 npm bin 执行
├── cli.d.ts
├── index.js     # 库入口 ESM，可通过 import { create } from 'smartbi' 编程式调用
└── index.d.ts
```

### tsdown 配置（`tsdown.config.ts`）

```ts
import { defineConfig, type UserConfig } from 'tsdown';

const config: UserConfig = defineConfig({
  entry: {
    cli: 'src/cli.ts',
    index: 'src/index.ts',
  },
  format: ['esm'],
  target: 'node18',
  clean: true,
  dts: true,
  sourcemap: false,
  minify: false,
  splitting: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  platform: 'node',
  shims: true,
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
});

export default config;
```

---

## 🤝 编程式 API

除了 CLI 调用，本工具也可作为库在代码中使用：

```ts
import { create } from 'smartbi';

await create('my-smartbi-ext', {
  force: true,
  default: true,
  alias: '别名',
  desc: '描述',
  cwd: '/path/to/parent',
  applicationContext: true,
  portlet: true,
  configurationPatch: true,
});
```

类型定义：

```ts
interface CreateOptions {
  force?: boolean;               // 强制覆盖
  default?: boolean;             // 使用默认值跳过交互
  alias?: string;                // 扩展别名
  desc?: string;                 // 扩展描述
  cwd?: string;                  // 父目录
  applicationContext?: boolean;  // 生成 applicationContext.xml
  portlet?: boolean;             // 生成 portlet.xml
  configurationPatch?: boolean;  // 生成 ConfigurationPatch.js
}
```

---

## 🚢 发布到 npm

### 1. 准备

1. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中添加 `NPM_TOKEN`（npm Granular Access Token，带 **Read & Write** 权限）。
2. 确保 `package.json` 中的仓库地址与实际 GitHub 地址一致。

### 2. 版本号打标签发布

```bash
# 正式版本（latest 渠道）
npm version patch        # 1.0.0 → 1.0.1
# or
npm version minor
# or
npm version major

# 预发布版本（next 渠道）
npm version 1.0.0-beta.1     # 或 alpha / rc

# 推送到 main 分支（触发 npm-publish.yml 自动化）
git push origin main --follow-tags
```

### 3. 自动化流程

推送 `main` 分支后，`.github/workflows/npm-publish.yml` 会自动执行：

1. **Node 26** 环境 `cache node_modules` → `npm ci`（未命中缓存时）→ `npm run typecheck` → `npm run build`
2. **构建产物校验**：`dist/cli.js / index.js / index.d.ts` 存在、shebang 正确、`--version` 正常
3. **Tarball 合规校验**：`npm pack` → 解压 → 断言 `bin.smartbi` 字段存在且指向的文件在 tarball 内（避免 npm publish 时被当作 invalid 移除）
4. **CLI 冒烟测试**：`create SmokeExt -y -f`，检查 5 个核心文件存在、`name/alias` 正确注入、XML 特殊字符转义
5. **版本跳过预检**：`npm view smartbi@<版本> version`，**已发布版本自动跳过**（不返回错误，workflow 保持绿）
6. `npm publish`（注入 `NODE_AUTH_TOKEN + NPM_TOKEN`，`publishConfig.access=public`）

---

## ❓ 常见问题

<details>
<summary>Q: 构建时报错 `Failed to import module "unrun". Please ensure it is installed.`？</summary>
<br>

`tsdown 0.22.x` 加载配置文件时动态依赖 [`unrun`](https://www.npmjs.com/package/unrun)（quansync 同步化执行器），但没声明为自动依赖。修复方法：

```bash
# 方式一：直接补装（本项目已经在 devDependencies 中添加）
npm install -D unrun

# 方式二：升级 Node 到 22+ 后重新 npm ci / npm install，让可选二进制正确安装
nvm install 22 && nvm use 22
rm -rf node_modules package-lock.json
npm install
npm run build
```

</details>

<details>
<summary>Q: 构建时 rolldown native binding 找不到（`Cannot find module './rolldown-binding.*.node'`）？</summary>
<br>

Rolldown 是 Rust 编写的原生模块，需要 npm 根据当前 Node 版本下载对应的 `@rolldown/binding-<platform>-<arch>` 可选依赖。请确保：

1. Node.js **≥ 22.0.0**
2. 使用官方 npm（不是 bun add 等其他包管理器）执行 `npm install` / `npm ci`
3. 如果之前用了低版本 Node 装过依赖，清掉重来：

```bash
nvm install 22 && nvm use 22
rm -rf node_modules package-lock.json
npm install
npm run build
```

</details>

<details>
<summary>Q: 生成项目后如何导入 Eclipse？</summary>
<br>

1. 启动 Eclipse
2. `File → Import → General → Existing Projects into Workspace`
3. 选择生成的项目目录即可（`.project` 已包含 Java / Web 模块）

</details>

<details>
<summary>Q: 如何移除不需要的可选文件？</summary>
<br>

- **不生成 Spring 配置**：`smartbi create my-ext --no-application-context`
- **不生成 Portlet 示例**：`smartbi create my-ext --no-portlet`
- **不生成前端扩展点**：`smartbi create my-ext --no-configuration-patch`

三个开关可任意组合。

</details>

---

## 📄 许可证

MIT © SmartBI Team

---

[ci-badge]: https://github.com/StillAlexLiu/smartbi-ext-create/actions/workflows/npm-publish.yml/badge.svg
[ci-url]: https://github.com/StillAlexLiu/smartbi-ext-create/actions/workflows/npm-publish.yml
[npm-version-badge]: https://img.shields.io/npm/v/smartbi.svg
[npm-downloads-badge]: https://img.shields.io/npm/dt/smartbi.svg
[npm-url]: https://www.npmjs.com/package/smartbi
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
