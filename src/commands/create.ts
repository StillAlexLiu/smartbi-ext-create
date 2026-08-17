import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import type { CreateOptions, CreateAnswers } from '../types';

const execFileAsync = promisify(execFile);

function escapeXmlAttr(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r/g, '&#13;')
    .replace(/\n/g, '&#10;')
    .replace(/\t/g, '&#9;');
}

function buildExtensionXml(name: string, alias: string, desc: string): string {
  const safeName = escapeXmlAttr(name);
  const safeAlias = escapeXmlAttr(alias);
  const safeDesc = escapeXmlAttr(desc);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE extension SYSTEM "extension.dtd">
<extension name="${safeName}" alias="${safeAlias}" desc="${safeDesc}" priority="100" version="1.0">
	<enable-jsp-processor>1</enable-jsp-processor>
	<!--  
	<servlet> 
		<servlet-name>TestServlet</servlet-name> 
		<servlet-class>smartbi.extension.test.TestServlet</servlet-class> 
		<init-param>  
			<param-name>x</param-name> 
			<param-value>xv</param-value>  
		</init-param>  
		<init-param>
			<param-name>y</param-name>  
			<param-value>yv</param-value> 
		</init-param> 
		<load-on-startup>1</load-on-startup>  
	</servlet>
	<servlet-mapping>  
		<servlet-name>TestServlet</servlet-name> 
		<url-pattern>/TestServlet</url-pattern>  
	</servlet-mapping> 
	-->
</extension>`;
}

function buildBuildXml(name: string): string {
  const safeName = escapeXmlAttr(name);
  return `<?xml version="1.0" encoding="UTF-8"?>
<project name="${safeName}" default="dist">
    <property name="ext_name" value="${safeName}"/>
    <target name="clean">
        <echo>==============</echo>
        <echo>\${ant.project.name}: clean</echo>
        <echo>==============</echo>
        <delete dir="\${basedir}/dist"/>
    </target>
    <target name="init">
        <echo>==============</echo>
       <echo>\${ant.project.name}: init</echo>
        <echo>==============</echo>
        <tstamp><format property="today" pattern="yyyy-MM-dd HH:mm:ss"/></tstamp>
        <mkdir dir="\${basedir}/dist"/>
        <mkdir dir="\${basedir}/lib-compile"/>
        <mkdir dir="\${basedir}/src/web/META-INF/lib"/>
        <mkdir dir="\${basedir}/src/web/META-INF/classes"/>
        <property name="Application.Tstamp" value="\${basedir}/dist/Application.Tstamp"/>
        <touch file="\${Application.Tstamp}" datetime="\${today}" pattern="yyyy-MM-dd HH:mm:ss"/>
    </target>
    <target name="compile">
        <echo>==============</echo>
        <echo>\${ant.project.name}: compile</echo>
        <echo>==============</echo>
        <javac encoding="UTF-8" destdir="\${basedir}/src/web/META-INF/classes" srcdir="\${basedir}/src/java" debug="true">
            <classpath>
                <fileset dir="\${basedir}/lib-compile" />
                <fileset dir="\${basedir}/src/web/META-INF/lib"/>
            </classpath>
        </javac>
        <copy todir="\${basedir}/src/web/META-INF/classes" overwrite="true">
            <fileset dir="\${basedir}/src/java">
                <include name="**/*.properties"/>
                <include name="**/*.xml"/>
            </fileset>
        </copy>
    </target> 
    <target name="jar">
        <echo file="\${basedir}/src/web/META-INF/version.txt" message="\${today}" />
        <jar destfile="\${basedir}/dist/\${ext_name}.ext" duplicate="preserve">
            <fileset dir="\${basedir}/src/web">  
                <exclude name="**/.gitignore" />  
                <exclude name="**/META-INF/jsp_classes/**" />
            </fileset>  
        </jar>
        <delete file="\${basedir}/src/web/META-INF/version.txt"/>
    </target> 
    <target name="dist" depends="init">
        <echo>==============</echo>
        <echo>\${ant.project.name}: dist</echo>
        <echo>==============</echo> 
        <antcall target="compile"/>
        <antcall target="jar"/> 
    </target> 
</project>`;
}

function buildProjectFile(name: string): string {
  const safeName = escapeXmlAttr(name);
  return `<?xml version="1.0" encoding="UTF-8"?>
<projectDescription>
	<name>${safeName}</name>
	<comment></comment>
	<projects>
	</projects>
	<buildSpec>
		<buildCommand>
			<name>org.eclipse.jdt.core.javabuilder</name>
			<arguments>
			</arguments>
		</buildCommand>
	</buildSpec>
	<natures>
		<nature>org.eclipse.jdt.core.javanature</nature>
	</natures>
</projectDescription>`;
}

function buildClasspath(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<classpath>
	<classpathentry kind="src" path="src/java"/>
	<classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER"/>
	<classpathentry kind="output" path="src/web/META-INF/classes"/> 
</classpath>`;
}

function buildWebXml(): string {
  return '<web-app/>';
}

function buildApplicationContext(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE beans PUBLIC "-//SPRING//DTD BEAN 2.0//EN" "http://www.springframework.org/dtd/spring-beans-2.0.dtd">
<beans>
    <bean id="framework" class="smartbi.framework.Framework" factory-method="getInstance">
        <property name="modules">
			<map>
				<!--  
				<entry><key><value>WizardQueryService</value></key><ref bean="WizardQueryService" /></entry>
				<entry><key><value>wizardQueryModule</value></key><ref bean="wizardQueryModule" /></entry>
				-->
			</map>
        </property>
    </bean>
    <bean id="rmi" class="smartbi.framework.rmi.RMIModule" factory-method="getInstance">
        <property name="modules">
			<map>
				<!--  
				<entry><key><value>WizardQueryService</value></key><ref bean="WizardQueryService" /></entry>
				-->
			</map>
        </property>
    </bean>
	<!--  
	<bean id="wizardQueryModule" class="smartbi.wizard.query.WizardQueryModule" factory-method="getInstance">
		<property name="daoModule" ref="dao"/>
	</bean>
	<bean id="WizardQueryService" class="smartbi.wizard.query.WizardQueryService" factory-method="getInstance"></bean>
	--> 
</beans>`;
}

function buildPortletXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<portlet-app>
	<!--  
	<portlet title="" icon="">
        <portlet-name>WIZARD_SIMPLE_REPORT</portlet-name>
        <display-name>Wizard Simple Report</display-name>
        <description></description>
        <is-bof-tree-node>true</is-bof-tree-node>
		<portlet-viewer-js-class>smartbi.wizard.handler.WizardSimpleReportPortletViewer</portlet-viewer-js-class>
		<portlet-editor-js-class>smartbi.wizard.handler.WizardSimpleReportPortletEditor</portlet-editor-js-class>
	</portlet> 
	--> 
</portlet-app>`;
}

function buildConfigurationPatch(): string {
  return `var ConfigurationPatch = {
    extensionPoints: {}
};`;
}

const DIRS = [
  'lib-compile',
  'src/java',
  'src/web/WEB-INF',
  'src/web/META-INF',
  'src/web/META-INF/classes',
  'src/web/META-INF/lib',
  'src/web/vision',
  'src/web/vision/css',
  'src/web/vision/img',
  'src/web/vision/js',
  'src/web/vision/js/ext'
];

const GITIGNORE_CONTENT = `dist
classes
jsp_classes
`;

const LANG_FILE_COMMENT = '# SmartBI extension i18n resources\n';

const DEFAULT_VUE_MODULE_REPO = 'https://git.alexcharts.top:7443/smartbi/vue-ext/smartbi-ext-build-tool.git';
const DEFAULT_VUE_MODULE_BRANCH = 'main';

const GIT_META_NAMES = new Set([
  '.git',
  '.gitignore',
  '.gitattributes',
  '.gitmodules',
  '.github'
]);

async function copyCodeOnly(srcDir: string, destDir: string): Promise<void> {
  await fs.ensureDir(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (GIT_META_NAMES.has(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyCodeOnly(srcPath, destPath);
    } else {
      await fs.copy(srcPath, destPath, { overwrite: true });
    }
  }
}

async function cloneVueModule(
  targetVueDir: string,
  repo: string,
  branch: string
): Promise<void> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smartbi-vue-ext-'));
  try {
    const args: string[] = ['clone', '--depth', '1'];
    if (branch && branch.trim().length > 0) {
      args.push('--branch', branch.trim(), '--single-branch');
    }
    args.push(repo, tempDir);
    await execFileAsync('git', args);

    await copyCodeOnly(tempDir, targetVueDir);
  } finally {
    await fs.remove(tempDir);
  }
}

async function promptForOptions(
  extName: string,
  targetDir: string,
  exists: boolean,
  options: CreateOptions
): Promise<CreateAnswers> {
  const defaults: CreateAnswers = {
    overwrite: false,
    alias: options.alias ?? extName,
    desc: options.desc ?? extName,
    applicationContext: options.applicationContext ?? true,
    portlet: options.portlet ?? true,
    configurationPatch: options.configurationPatch ?? true,
    vueModule: options.vueModule ?? false,
    vueModuleRepo: options.vueModuleRepo ?? DEFAULT_VUE_MODULE_REPO,
    vueModuleBranch: options.vueModuleBranch ?? DEFAULT_VUE_MODULE_BRANCH
  };

  if (options.default) {
    return { ...defaults, vueModule: options.vueModule ?? true };
  }

  const questions = [];

  if (exists) {
    questions.push({
      type: 'confirm',
      name: 'overwrite',
      message: `目录 ${chalk.cyan(targetDir)} 已经存在，确定覆盖？`,
      default: false
    });
  }

  questions.push(
    {
      type: 'input',
      name: 'alias',
      message: '请输入扩展别名（可空）：',
      default: defaults.alias
    },
    {
      type: 'input',
      name: 'desc',
      message: '请输入扩展描述（可空）：',
      default: defaults.desc
    },
    {
      type: 'confirm',
      name: 'applicationContext',
      message: '是否生成 applicationContext.xml 文件？',
      default: defaults.applicationContext
    },
    {
      type: 'confirm',
      name: 'portlet',
      message: '是否生成 portlet.xml 文件？',
      default: defaults.portlet
    },
    {
      type: 'confirm',
      name: 'configurationPatch',
      message: '是否生成 ConfigurationPatch.js 文件？',
      default: defaults.configurationPatch
    },
    {
      type: 'confirm',
      name: 'vueModule',
      message: '是否添加新模块扩展包（从 Git 私有仓库拉取 Vue 模块代码到 src/vue）？',
      default: defaults.vueModule
    }
  );

  const phase1Answers = await inquirer.prompt(questions);
  const merged: CreateAnswers = { ...defaults, ...phase1Answers };

  if (merged.vueModule) {
    const followups = await inquirer.prompt([
      {
        type: 'input',
        name: 'vueModuleRepo',
        message: 'Vue 模块 Git 仓库地址：',
        default: merged.vueModuleRepo
      },
      {
        type: 'input',
        name: 'vueModuleBranch',
        message: 'Vue 模块 Git 分支：',
        default: merged.vueModuleBranch
      }
    ]);
    merged.vueModuleRepo = followups.vueModuleRepo;
    merged.vueModuleBranch = String(followups.vueModuleBranch ?? merged.vueModuleBranch).trim();
  }

  return merged;
}

export async function create(projectName: string, options: CreateOptions): Promise<void> {
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
  const targetDir = path.join(cwd, projectName);
  const exists = fs.existsSync(targetDir);

  console.log();
  console.log(chalk.cyan(`🚀 Smartbi 扩展项目脚手架`));
  console.log();
  console.log(`  项目名称：${chalk.yellow(projectName)}`);
  console.log(`  创建目录：${chalk.cyan(targetDir)}`);
  console.log();

  if (exists && options.force) {
    console.log(chalk.yellow('  [force] 目标目录已存在，正在移除...'));
    await fs.remove(targetDir);
  }

  const answers = await promptForOptions(projectName, targetDir, exists && !options.force, options);

  if (exists && !options.force && !answers.overwrite) {
    console.log(chalk.yellow('已取消创建。'));
    return;
  }

  if (exists && !options.force && answers.overwrite) {
    console.log(chalk.yellow('  目标目录已存在，正在移除...'));
    await fs.remove(targetDir);
  }

  let spinner = ora('正在创建项目结构...').start();

  try {
    for (const dir of DIRS) {
      await fs.ensureDir(path.join(targetDir, dir));
    }

    await fs.writeFile(path.join(targetDir, 'src/web/META-INF/extension_lang_en.properties'), LANG_FILE_COMMENT, 'utf-8');
    await fs.writeFile(path.join(targetDir, 'src/web/META-INF/extension_lang_zh_CN.properties'), LANG_FILE_COMMENT, 'utf-8');
    await fs.writeFile(path.join(targetDir, 'src/web/META-INF/extension_lang_zh_TW.properties'), LANG_FILE_COMMENT, 'utf-8');

    await fs.writeFile(path.join(targetDir, 'src/web/WEB-INF/web.xml'), buildWebXml(), 'utf-8');

    await fs.writeFile(path.join(targetDir, '.gitignore'), GITIGNORE_CONTENT, 'utf-8');

    await fs.writeFile(path.join(targetDir, '.project'), buildProjectFile(projectName), 'utf-8');
    await fs.writeFile(path.join(targetDir, '.classpath'), buildClasspath(), 'utf-8');

    await fs.writeFile(
      path.join(targetDir, 'src/web/META-INF/extension.xml'),
      buildExtensionXml(projectName, answers.alias, answers.desc),
      'utf-8'
    );

    await fs.writeFile(path.join(targetDir, 'build.xml'), buildBuildXml(projectName), 'utf-8');

    if (answers.applicationContext) {
      await fs.writeFile(
        path.join(targetDir, 'src/web/META-INF/applicationContext.xml'),
        buildApplicationContext(),
        'utf-8'
      );
    }

    if (answers.portlet) {
      await fs.writeFile(
        path.join(targetDir, 'src/web/META-INF/portlet.xml'),
        buildPortletXml(),
        'utf-8'
      );
    }

    if (answers.configurationPatch) {
      await fs.writeFile(
        path.join(targetDir, 'src/web/vision/js/ext/ConfigurationPatch.js'),
        buildConfigurationPatch(),
        'utf-8'
      );
    }

    spinner.succeed(chalk.green('项目结构创建完成！'));
  } catch (err) {
    spinner.fail(chalk.red(`项目创建失败：${(err as Error).message}`));
    throw err;
  }

  if (answers.vueModule) {
    spinner = ora(`正在拉取 Vue 模块代码（${answers.vueModuleRepo} @ ${answers.vueModuleBranch}）...`).start();
    const targetVueDir = path.join(targetDir, 'src', 'vue');
    try {
      await cloneVueModule(targetVueDir, answers.vueModuleRepo, answers.vueModuleBranch);
      spinner.succeed(chalk.green('Vue 模块代码拉取完成！'));
    } catch (err) {
      const msg = (err as Error).message || String(err);
      spinner.fail(chalk.red(`Vue 模块代码拉取失败：${msg}`));
      console.log();
      console.log(chalk.yellow('  提示：私有仓库拉取失败通常是 Git 凭据未配置。'));
      console.log(chalk.yellow('  请检查：'));
      console.log(chalk.gray('    1. 是否安装了 git 并且可在终端使用：git --version'));
      console.log(chalk.gray('    2. 是否在本机 Git（或 Credential Manager）中配置了私有仓库的用户名/密码或 SSH Key'));
      console.log(chalk.gray('    3. 仓库地址与分支是否正确'));
      console.log();
      console.log(chalk.gray(`  仓库：${answers.vueModuleRepo}`));
      console.log(chalk.gray(`  分支：${answers.vueModuleBranch}`));
      console.log();
      throw err;
    }
  }

  console.log();
  console.log(chalk.green('🎉 Smartbi 扩展项目创建成功！'));
  console.log();
  console.log(`${chalk.gray('  项目路径：')} ${chalk.cyan(targetDir)}`);
  console.log();
  console.log(chalk.cyan('  目录结构：'));
  for (const dir of DIRS) {
    console.log(chalk.gray(`    - ${dir}/`));
  }
  if (answers.vueModule) {
    console.log(chalk.gray('    - src/vue/              Vue 前端新模块扩展（Git 拉取）'));
  }
  console.log();
  console.log(chalk.cyan('  主要文件：'));
  console.log(chalk.gray('    - extension.xml           扩展配置'));
  console.log(chalk.gray('    - build.xml               Ant 构建脚本'));
  console.log(chalk.gray('    - .project / .classpath   Eclipse 项目配置'));
  if (answers.applicationContext) console.log(chalk.gray('    - applicationContext.xml  Spring 配置'));
  if (answers.portlet) console.log(chalk.gray('    - portlet.xml             Portlet 配置'));
  if (answers.configurationPatch) console.log(chalk.gray('    - ConfigurationPatch.js   JS 扩展点'));
  if (answers.vueModule) {
    console.log(chalk.gray('    - src/vue/                Vue 前端模块工程（代码来源：Git 私有仓库）'));
    console.log(chalk.gray(`      · 仓库 ${answers.vueModuleRepo}`));
    console.log(chalk.gray(`      · 分支 ${answers.vueModuleBranch}`));
  }
  console.log();
  console.log(chalk.yellow('  下一步：导入 Eclipse 或直接使用 Ant 执行 dist 目标打包 .ext 文件'));
  console.log();
}
