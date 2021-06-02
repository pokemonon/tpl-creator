import * as path from 'path';

import { program } from 'commander';
import { prompt } from 'inquirer';

import { create } from '../src/create';
import { Context } from '../src/Container';

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
// export interface Context {
//     appName: string;
//     appPath: string;
//     cwd: string;
//     opts: Opts;
// }
// export type Context = ContainerCtx<Opts>
async function start() {
    const cwd = process.cwd();
    const opts = program.opts() as Opts;

    let appName = program.args[0];
    if (!appName || appName === 'undefined') {
        const ans = await prompt([
            {
                type: 'input',
                message: '请输入项目名',
                name: 'appName',
                validate: (ipt) => !!ipt,
            },
        ]);

        appName = ans.appName;
    }
    
    const appPath = path.resolve(cwd, appName);
    appName = appPath.split(path.sep).pop()!;


    const ctx: Context = {
        appName,
        appPath,
        cwd,
        opts,
    };
    
    create(ctx);
}

start();

// tpl create appName -p ./preset1