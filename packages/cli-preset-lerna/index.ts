
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
            plugins: [
                require('@pokemonon/tpl-cli-plugin-lerna').default,
                require('@pokemonon/tpl-cli-plugin-eslint').default,
                require('@pokemonon/tpl-cli-plugin-husky').default,
            ],
        };
    }

    static setPrompts(): QuestionCollection {
        return [];
    }
}

export default PresetTpl;
