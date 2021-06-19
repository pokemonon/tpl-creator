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
            const lernaConfPath = api.generatorAPI.findFile('lerna.json');

            const pkg = getJsonData(api.generatorAPI.files[pkgPath]);
            Object.assign(pkg.devDependencies = pkg.devDependencies || {}, {
                'commitizen': '^4.2.4',
                // 'conventional-changelog-cli': '^2.1.1',
                'cz-conventional-changelog': '^3.3.0',
                'husky': '^6.0.0',
                'standard-version': '^9.3.0',
            });
            Object.assign(pkg.config = pkg.config || {}, {
                'commitizen': {
                    'path': './node_modules/cz-conventional-changelog',
                },
            });

            if (lernaConfPath) {
                Object.assign(pkg.scripts = pkg.scripts || {}, {
                    'dump': 'HUSKY=0 lerna version',
                    'release': 'lerna publish from-git --yes',
                });
            } else {
                Object.assign(pkg.scripts = pkg.scripts || {}, {
                    'dump': 'HUSKY=0 standard-version --release-as',
                    'release': 'npm publish',
                });
            }
            

            api.generatorAPI.files[pkgPath] = JSON.stringify(pkg, null, 4);

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
