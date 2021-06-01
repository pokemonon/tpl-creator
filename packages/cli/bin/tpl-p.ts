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
        '../packages/cli-p',
    ], { stdio: 'inherit' });
}

start();