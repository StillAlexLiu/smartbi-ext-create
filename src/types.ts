export interface CreateOptions {
  force?: boolean;
  alias?: string;
  desc?: string;
  applicationContext?: boolean;
  portlet?: boolean;
  configurationPatch?: boolean;
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
}
