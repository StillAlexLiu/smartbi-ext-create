# smartbi-ext

> SmartBI 扩展项目开发脚手架。一条命令生成 Java + Eclipse + Ant 风格项目骨架，支持 Vue 前端新模块扩展。

[![CI][ci-badge]][ci-url]
[![npm version][npm-version-badge]][npm-url]
[![License: MIT][license-badge]][license-url]

---

## 快速开始

```bash
# 交互式创建
npx smartbi-ext create my-ext

# 无交互默认生成（含 Vue 模块）
npx smartbi-ext create my-ext -y

# 跳过 Vue 模块
npx smartbi-ext create my-ext --no-vue-module
```

全局安装：
```bash
npm i -g smartbi-ext
smartbi create my-ext
```

**环境要求**：Node.js ≥ 22，JDK 8+（打包扩展用）。

---

## 命令选项

```bash
smartbi create <project-name> [options]
```

| 选项 | 说明 | 默认 |
| --- | --- | --- |
| `-f, --force` | 目标目录存在时强制覆盖 | `false` |
| `-y, --default` | 跳过所有交互 | `false` |
| `-C, --cwd <path>` | 指定父目录 | 当前目录 |
| `--alias <name>` | 扩展别名 | 项目名 |
| `--desc <text>` | 扩展描述 | 项目名 |
| `--no-application-context` | 不生成 `applicationContext.xml` | 生成 |
| `--no-portlet` | 不生成 `portlet.xml` | 生成 |
| `--no-configuration-patch` | 不生成 `ConfigurationPatch.js` | 生成 |
| `--vue-module` | 启用 Vue 前端模块（`src/vue`） | 交互询问 |
| `--no-vue-module` | 禁用 Vue 前端模块 | - |
| `--package-manager <pkg>` | Vue 模块包管理：`npm \| yarn \| pnpm \| bun` | 自动检测 |
| `--vue-package-name <name>` | Vue 模块 `package.json` 的 `name` | 项目名 |

---

## Vue 前端模块

选择 `--vue-module` 后，会在 `src/vue` 目录执行：

1. **选包管理工具**：`npm` / `yarn` / `pnpm` / `bun`
2. **init**：生成 `package.json`，`name` 默认为项目名
3. **scripts**：自动注入 `"dev": "smartbi dev"`、`"build": "smartbi build"`
4. **安装依赖**：`smartbi-ext-vue-toolkit`（开发依赖）
5. **初始化**：运行 `smartbi init` 生成模板代码

开发：
```bash
cd src/vue
npm run dev    # 启动开发
npm run build  # 构建
```

---

## 项目结构

```
my-ext/
├── .classpath / .project          # Eclipse 配置
├── build.xml                      # Ant 构建（ant dist 打包 .ext）
├── .gitignore
├── lib-compile/
└── src/
    ├── java/                      # Java 源码
    ├── vue/                       # 🆕 Vue 前端模块（可选）
    └── web/
        ├── WEB-INF/web.xml
        ├── META-INF/
        │   ├── extension.xml      # 🔑 扩展核心配置
        │   ├── extension_lang_*.properties  # 国际化（中/繁/英）
        │   ├── applicationContext.xml       # Spring（可选）
        │   ├── portlet.xml                    # Portlet（可选）
        │   ├── classes/  lib/
        └── vision/js/ext/ConfigurationPatch.js  # 前端扩展点（可选）
```

打包：
```bash
cd my-ext
ant dist    # 输出 dist/my-ext.ext
```

---

## License

[MIT](LICENSE)

[ci-badge]: https://github.com/StillAlexLiu/smartbi-ext-create/actions/workflows/npm-publish.yml/badge.svg
[ci-url]: https://github.com/StillAlexLiu/smartbi-ext-create/actions/workflows/npm-publish.yml
[npm-version-badge]: https://img.shields.io/npm/v/smartbi-ext.svg
[npm-url]: https://www.npmjs.com/package/smartbi-ext
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
