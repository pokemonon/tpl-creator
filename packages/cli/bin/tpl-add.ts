import * as path from 'path';

import { program } from 'commander';

import { Context } from '../src/Container';
import { create } from '../src/create';

program
    .option('-P, --preset <presetName...>', '预设名 可以是路径')
    .option('--inlinePreset <presetJson...>', '')
    .option('-p, --plugin <pluginName...>', '')
    .option('--inlinePlugin <pluginJson...>', '')
    .parse(process.argv);

async function start() {
    const appPath = process.cwd();
    const appName = appPath.split(path.sep).pop()!;

    const ctx: Context = {
        appPath,
        appName,
        cwd: appPath,
        opts: program.opts(),
    };

    create(ctx);
}

start();