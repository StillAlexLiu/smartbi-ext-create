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
