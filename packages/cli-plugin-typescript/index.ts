
import { Context, Plugin, PluginsAPI, QuestionCollection } from '@pokemonon/tpl-cli';
import { getJsonData } from '@pokemonon/knife';

// eslint-disable-next-line
export interface Opts {}

class PluginTpl extends Plugin {
    constructor(ctx: Context, opts: Opts) {
        super(ctx, opts);
    }

    apply(api: PluginsAPI): void {
        const pkgPath = api.generatorAPI.findFile('package.json');
        if (pkgPath) {
            const pkg = getJsonData(api.generatorAPI.files[pkgPath]);
            Object.assign(pkg.devDependencies = pkg.devDependencies || {}, {
                'typescript': 'latest',
            });

            api.generatorAPI.files[pkgPath] = JSON.stringify(pkg, null, 4);

            api.render('./template');
        }
    }

    static setPrompts(): QuestionCollection {
        return [];
    }
}

export default PluginTpl;
