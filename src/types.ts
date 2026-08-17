export interface CreateOptions {
  force?: boolean;
  alias?: string;
  desc?: string;
  applicationContext?: boolean;
  portlet?: boolean;
  configurationPatch?: boolean;
  vueModule?: boolean;
  vueModuleRepo?: string;
  vueModuleBranch?: string;
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
  vueModuleRepo: string;
  vueModuleBranch: string;
}
