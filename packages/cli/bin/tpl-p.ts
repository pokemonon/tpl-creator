import * as path from 'path';

import execa from 'execa';
import { program } from 'commander';

program
    .option('-t, --type <type>', '')
    .parse(process.argv);

async function start() {
    const appName = program.args[0];

    await execa('tpl', [
        'create',
        appName,
        '-p',
        process.env.TPL_TEST ? path.resolve(__dirname, '../../cli-plugin-pop') : '@pokemonon/cli-plugin-pop',
    ], { stdio: 'inherit' });
}

start();