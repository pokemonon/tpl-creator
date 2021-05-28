import { createPromptModule, QuestionCollection } from 'inquirer';
import { SyncHook, SyncWaterfallHook } from 'tapable';

import Container, { Context } from './Container';
import { PluConfigArr } from './Creator';
import { GeneratorAPI } from './generator';

export declare class Plugin extends Container {
    constructor(ctx: Context, opts?: Record<string, unknown>)
    apply(api: PluginAPI): PluginAPI
    static setPrompts(api: PluginAPI): QuestionCollection
}

export class PluginAPI extends Container {
    plugins: Plugin[] = []
    pluginConfigs: PluConfigArr[]
    generatorAPI: GeneratorAPI
    hooks = Object.freeze({
        beforeGenerate: new SyncHook(),
        afterGenerate: new SyncHook(),
    })

    constructor(ctx: Context, pluginConfigs: PluConfigArr[]) {
        super(ctx);
        this.pluginConfigs = pluginConfigs;
        this.generatorAPI = new GeneratorAPI(ctx);
    }

    async prompt() {
        for (const config of this.pluginConfigs) {
            const [P, pluginOpts = {}] = config;
            const questions = await P.setPrompts?.(this) || [];

            const prompt = createPromptModule();
            const ans = await prompt(questions, pluginOpts);
            config[1] = ans;
        }
    }

    load() {
        this.plugins = this.pluginConfigs.map(config => {
            const [P, pluginOpts] = config;
            const p: Plugin = new P(this.ctx, pluginOpts);
            return p;
        });

        this.plugins.forEach(p => {
            p.apply(this);
        });

        this.generate();
    }

    render(source: string, additionalData = {}, ejsOptions = {}) {
        this.generatorAPI.render(source, additionalData, ejsOptions);
    }

    async generate() {
        this.hooks.beforeGenerate.call(() => {});
        this.generatorAPI.generate();
        this.hooks.afterGenerate.call(() => {});
    }
}
