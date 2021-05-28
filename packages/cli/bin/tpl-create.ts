import * as fs from 'fs';
import * as path from 'path';

import { program } from 'commander';

import { create } from '../src/create';

program
    // .command('create <app-name>')
    .option('-c, --config', 'config')
    .option('--inlineConfig <configJson>', '')
    .option('-P, --preset <presetName...>', '预设名 可以是路径')
    .option('--inlinePreset <presetJson...>', '')
    .option('-p, --plugin <pluginName...>', '')
    .option('--inlinePlugin <pluginJson...>', '')
    .option('-m, --packageManager <command>', '')
    .option('-r, --registry <url>', '')
    .option('-f, --force', '覆盖同名项目')
    .option('--merge', '')
    .parse(process.argv);

export interface Opts {
    config?: string;
    inlineConfig?: string;
    preset?: string[];
    inlinePreset?: string[];
    plugin?: string[];
    inlinePlugin?: string[];
}
export interface Context {
    appName: string;
    appPath: string;
    cwd: string;
    opts: Opts;
}
async function start() {
    const cwd = process.cwd();
    const opts = program.opts() as Opts;
    
    const appPath = path.resolve(cwd, program.args[0]);
    const appName = appPath.split(path.sep).slice(-1)[0];

    const ctx = {
        appName,
        appPath,
        cwd,
        opts,
    };
    
    create(ctx);
}

start();

// tpl create appName -p ./preset1