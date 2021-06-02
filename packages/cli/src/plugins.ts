import { createPromptModule, QuestionCollection } from 'inquirer';
import { SyncHook, SyncWaterfallHook, AsyncSeriesHook } from 'tapable';

import Container, { Context } from './Container';
import { PluConfigArr } from './Creator';
import { GeneratorAPI } from './generator';

export class Plugin extends Container {
    opts: Record<string, unknown>
    constructor(ctx: Context, opts) {
        super(ctx);
        this.opts = opts;
    }
    apply(api: PluginsAPI): void {}
    static setPrompts(api: PluginsAPI): QuestionCollection { return []; }
}

export class PluginsAPI extends Container {
    plugins: Plugin[] = []
    pluginConfigs: PluConfigArr[]
    generatorAPI: GeneratorAPI
    hooks = Object.freeze({
        beforeGenerate: new AsyncSeriesHook(),
        afterGenerate: new AsyncSeriesHook(),
    })

    #currentPlugin!: Plugin

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
            this.#currentPlugin = p;
            p.apply(this);
        });

        this.generate();
    }

    render(source: string, additionalData = {}, ejsOptions = {}) {
        this.generatorAPI.render(source, {
            ...this.#currentPlugin.opts,
            ...additionalData,
        }, ejsOptions);
    }

    async generate() {
        // @ts-ignore
        await this.hooks.beforeGenerate.callAsync(() => {});
        this.generatorAPI.generate();
        // @ts-ignore
        await this.hooks.afterGenerate.callAsync(() => {});
    }
}
