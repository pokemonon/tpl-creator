<% if (type === 'preset') { %>
import { Context, Preset, PresetsAPI, PresetResult, QuestionCollection } from '@pokemonon/tpl-cli';

// eslint-disable-next-line
export interface Opts {}

class PresetTpl extends Preset {
    constructor(ctx: Context, opts: Opts) {
        super(ctx, opts);
    }

    apply(api: PresetsAPI): PresetResult {
        return {
            presets: [],
            plugins: [],
        };
    }

    static setPrompts(): QuestionCollection {
        return [];
    }
}

export default PresetTpl;
<% } else { %>
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
<% } %>