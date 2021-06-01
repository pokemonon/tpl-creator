
import { Context, Plugin, PluginsAPI, QuestionCollection } from '@pokemonon/tpl-cli';

// eslint-disable-next-line
export interface Opts {}

class PluginTpl extends Plugin {
    constructor(ctx: Context, opts: Opts) {
        super(ctx, opts);
    }

    apply(api: PluginsAPI): void {}

    static setPrompts(): QuestionCollection {
        return [];
    }
}

export default PluginTpl;
