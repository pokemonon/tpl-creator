import execa from 'execa';
import { chmodSync, constants } from 'fs-extra';
import { Context, Plugin, PluginsAPI, QuestionCollection } from '@pokemonon/tpl-cli';
import { getJsonData } from '@pokemonon/knife';
import { hasGit } from '@pokemonon/knife/node';

// eslint-disable-next-line
export interface Opts {}

class PluginTpl extends Plugin {
    constructor(ctx: Context, opts: Opts) {
        super(ctx, opts);
    }

    apply(api: PluginsAPI): void {
        // todo husky的安装
        const pkgPath = api.generatorAPI.findFile('package.json');
        if (pkgPath) {
            const pkg = getJsonData(api.generatorAPI.files[pkgPath]);
            Object.assign(pkg.devDependencies = pkg.devDependencies || {}, {
                'commitizen': '^4.2.4',
                'conventional-changelog-cli': '^2.1.1',
                'cz-conventional-changelog': '^3.3.0',
                'husky': '^6.0.0',
            });
            Object.assign(pkg.config = pkg.config || {}, {
                'commitizen': {
                    'path': './node_modules/cz-conventional-changelog',
                },
            });
            if (!pkg.scripts || !pkg.scripts.changelog) {
                Object.assign(pkg.scripts, {
                    'changelog': 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
                });
            }

            api.generatorAPI.files['package.json'] = JSON.stringify(pkg, null, 4);

            api.render('./templates/npm');


            api.hooks.afterGenerate.tapPromise('cli-plugin-husky', async () => {
                chmodSync(api.generatorAPI.findFile('prepare-commit-msg')!, '777');

                if (!hasGit()) {
                    // todo 没有安装git
                    return;
                }

                await execa('git', ['init']);
                await execa('git', ['config', '--local', 'core.hooksPath', '.husky']);
            });

        }
    }

    static setPrompts(): QuestionCollection {
        return [];
    }
}

export default PluginTpl;
