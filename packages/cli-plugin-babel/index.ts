
import { Context, Plugin, PluginsAPI, QuestionCollection } from '@pokemonon/tpl-cli';
import { getJsonData } from '@pokemonon/knife';

enum library {
    vue2,
    vue3,
    react
}
// eslint-disable-next-line
export interface Opts {
    library: library
}

class PluginTpl extends Plugin {
    constructor(ctx: Context, opts: Opts) {
        super(ctx, opts);
    }

    apply(api: PluginsAPI): void {
        const { library } = this.opts;
        const pkgPath = api.generatorAPI.findFile('package.json');
        if (pkgPath) {
            const pkg = getJsonData(api.generatorAPI.files[pkgPath]);
            const devDependencies = pkg.devDependencies = pkg.devDependencies || {};
            if (library === 'vue2') {
                Object.assign(devDependencies, {
                    '@vue/babel-preset-jsx': '^1.2.4',
                });
            } else if (library === 'vue3') {
                Object.assign(devDependencies, {
                    '@vue/babel-plugin-jsx': '^1.0.6',
                });
            } else if (library === 'react') {
                Object.assign(devDependencies, {
                    '@babel/preset-react': '^7.14.5',
                });
            }
            api.generatorAPI.files[pkgPath] = JSON.stringify(pkg, null, 4);
        }
        api.render('./template');
    }

    static setPrompts(): QuestionCollection {
        return [
            {
                name: 'library',
                message: 'choose one library',
                type: 'list',
                choices: [
                    {
                        name: 'no library',
                        value: '',
                    },
                    'vue2',
                    'vue3',
                    'react',
                ],
            },
        ];
    }
}

export default PluginTpl;
