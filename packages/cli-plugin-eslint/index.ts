
import { Context, Plugin, PluginsAPI, QuestionCollection } from '@pokemonon/tpl-cli';
import { getJsonData } from '@pokemonon/knife';

// eslint-disable-next-line
export interface Opts {}

class PluginTpl extends Plugin {
    constructor(ctx: Context, opts: Opts) {
        super(ctx, opts);
    }

    apply(api: PluginsAPI): void {
        // const files = api.generatorAPI.files;
        const pkgPath = api.generatorAPI.findFile('package.json');
        if (pkgPath) {
            const pkg = getJsonData(api.generatorAPI.files[pkgPath]);

            // Object.assign((pkg.dependencies = pkg.dependencies || {}), {});
            Object.assign((pkg.devDependencies = pkg.devDependencies || {}), {
                'eslint': '^7.27.0',
                '@pokemonon/eslint-plugin-common': '^0.0.1',
            });

            api.generatorAPI.files[pkgPath] = JSON.stringify(pkg, null, 4);

            let vue = pkg.dependencies?.vue;
            vue = vue ? vue.match(/(\d+)/)[1] : false;

            api.render('./template', {
                vue: vue,
            });
            // const hasTs = pkg.dependencies.typescript || pkg.devDependencies.typescript;
            // if (hasTs) {
            //     //
            // }
        }
    }

    static setPrompts(): QuestionCollection {
        return [];
    }
}

export default PluginTpl;
