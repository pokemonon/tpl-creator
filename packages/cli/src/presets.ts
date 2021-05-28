import * as path from 'path';

import { isArray, sureArray } from '@pokemonon/knife';
import { SyncWaterfallHook } from 'tapable';
import { prompt, createPromptModule, QuestionCollection } from 'inquirer';

import Container, { Context } from './Container';
import { PresetConfig } from './config';
import pkg from './lib/pkg';
import { Plugin } from './plugins';
import { formatConfig, isLocalSource } from './lib/utils';
import { PluConfigArr, PreConfigArr } from './Creator';

export declare class Preset extends Container {
    constructor(ctx: Context, opts?: Record<string, unknown>)
    apply(api: PresetsAPI): PresetResult
    static setPrompts(api: PresetsAPI): QuestionCollection
}

export type PreConfig = typeof Preset | [typeof Preset, Record<string, unknown>?];
export type PluConfig = typeof Plugin | [typeof Plugin, Record<string, unknown>?];
// 用户配置preset的返回结果
export interface PresetResult {
    presets?: PreConfig[];
    plugins?: PluConfig[];
}
// presets format后的结果
export interface PresetResultArr {
    presets?: PreConfigArr[];
    plugins?: PluConfigArr[];
}

export class PresetsAPI extends Container {
    presetConfigs: PreConfigArr[]
    presets: Preset[] = [] // 实例集合
    presetResultArr: PresetResultArr = {}

    hooks = Object.freeze({
        // initialize: new SyncWaterfallHook(),
    })
    
    constructor(ctx: Context, presetConfigs: PreConfigArr[]) {
        super(ctx);
        this.presetConfigs = presetConfigs;
    }

    // 交互
    async prompt() {
        for (const config of this.presetConfigs) {
            const [P, presetOpts = {}] = config;
            // 如果不存在配置，则进行交互
            const questions = P.setPrompts?.(this) || [];

            const prompt = createPromptModule();
            const ans = await prompt(questions, presetOpts);
            config[1] = ans;
        }
    }

    load() {
        // 实例化preset
        this.presets = this.presetConfigs.map(config => {
            const [P, presetOpts] = config;
            const p: Preset = new P(this.ctx, presetOpts);
            return p;
        });

        // todo presets或者plugins重复问题
        // 执行presets的apply逻辑
        const presets = [...this.presets];
        const pluginConfigs: PluConfigArr[] = [];
        while (presets.length) {
            const preset = presets.shift()!;
            const presetResult = preset.apply(this);
            const presetResultArr: PresetResultArr = {
                presets: presetResult.presets ? formatConfig(presetResult.presets) : [],
                plugins: presetResult.plugins ? formatConfig(presetResult.plugins) : [],
            };

            // 处理嵌套的presets
            presets!.push(...presetResultArr.presets!.map(preConfig => {
                const [P, presetOpts] = preConfig;
                return new P(this.ctx, presetOpts);
                // return new preConfig[0](this.ctx, preConfig[1]);
                // if (isArray(preConfig)) {
                //     return new preConfig[0](this.ctx, preConfig[1]);
                // }
                // return new preConfig(this.ctx);
            }));

            pluginConfigs.push(...presetResultArr.plugins!);
        }

        this.presetResultArr.plugins = pluginConfigs;
    }

    // preset合并结果
    getPresetResultArr() {
        return this.presetResultArr;
    }
}
