export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface CreateOptions {
  force?: boolean;
  alias?: string;
  desc?: string;
  applicationContext?: boolean;
  portlet?: boolean;
  configurationPatch?: boolean;
  vueModule?: boolean;
  packageManager?: PackageManager;
  vuePackageName?: string;
  default?: boolean;
  cwd?: string;
}

export interface CreateAnswers {
  overwrite: boolean;
  alias: string;
  desc: string;
  applicationContext: boolean;
  portlet: boolean;
  configurationPatch: boolean;
  vueModule: boolean;
  packageManager: PackageManager;
  vuePackageName: string;
}
