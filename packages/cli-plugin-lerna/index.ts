
import { Context, Plugin, PluginsAPI, QuestionCollection } from '@pokemonon/tpl-cli';

// eslint-disable-next-line
export interface Opts {}

class PluginTpl extends Plugin {
    constructor(ctx: Context, opts: Opts) {
        super(ctx, opts);
    }

    apply(api: PluginsAPI): void {
        api.render('./template');
    }

    static setPrompts(): QuestionCollection {
        return [
            {
                type: 'confirm',
                name: 'isIndependent',
                message: '请选择是否启用independent模式',
            },
        ];
    }
}

export default PluginTpl;
