import * as path from 'path';

import { getJsonData, isArray, isObject, isString } from '@pokemonon/knife';
import { importDefault } from '@pokemonon/knife/node'; 

import { Opts } from '../bin/tpl-create';
import { Context } from './Container';
import { Preset } from './presets';
import { Plugin } from './plugins';
import { isLocalSource } from './lib/utils';
import pkg from './lib/pkg';
// import { formatConfig } from './lib/utils';

// 将单个配置格式化 T | [T, Opts] => [T, Opts]
export const formatItemConfig = <T, K = [T, Record<string, unknown>]>(config): K => isArray<any>(config) ? config : [config, {}];
// 将多个配置格式化 [T, [T, Opts]] => [[T, Opts], [T, Opts]]
export const formatConfig = <T>(config) => config.map((i) => formatItemConfig<T>(i));

// 用户配置数据结构
export type PresetConfig = string | typeof Preset | [string | typeof Preset, Record<string, unknown>];
export type PluginConfig = string | typeof Plugin | [string | typeof Plugin, Record<string, unknown>];
export interface Config {
    presets?: PresetConfig[];
    plugins?: PluginConfig[];
}
export const defineConfig = (config: Config) => config;

// 格式化用户配置
export type PresetConfigArr = [string | typeof Preset, Record<string, unknown>];
export type PluginConfigArr = [string | typeof Plugin, Record<string, unknown>];
export interface ConfigArr {
    presets?: PresetConfigArr[];
    plugins?: PluginConfigArr[];
}

// 加载资源后的格式
export type PreConfigArr = [typeof Preset, Record<string, unknown>];
export type PluConfigArr = [typeof Plugin, Record<string, unknown>];
export interface ConfigRequiredArr {
    presets?: PreConfigArr[];
    plugins?: PluConfigArr[];
}

// 加载配置信息
export const loadConfig = (opts: Opts) => {
    const config: ConfigArr = {};
    if (opts.config) {
        // 配置文件处理

    } else {
        let presets: PresetConfig[] = [];
        if (opts.inlinePreset) {
            presets = opts.inlinePreset.map(p => getJsonData(p, ''));
        } else if (opts.preset) {
            presets = opts.preset;
        }
        config.presets = formatConfig(presets);

        let plugins: PluginConfig[] = [];
        if (opts.inlinePlugin) {
            plugins = opts.inlinePlugin.map(p => getJsonData(p, ''));
        } else if (opts.plugin) {
            plugins = opts.plugin;
        }
        config.plugins = formatConfig(plugins);
    }

    return config;
};

// require配置的preset|plugin
export async function getRequiredConfig<T extends any[], K extends any[]>(ctx: Context, configList: T[]) {
    const needIns: string[] = [];
    configList.forEach(p => {
        const [name] = p;
        if (isString(name) && !isLocalSource(name)) {
            needIns.push(name);
        }
    });
    needIns.length && await pkg.add(needIns);

    return configList.map(p => {
        const [name, presetOpts] = p;
        const P = isString(name) ?
            importDefault(require(isLocalSource(name) ? path.resolve(ctx.cwd, name) : pkg.resolve(name))).default :
            name;
        return [P, presetOpts] as K;
    });
}

// defineConfig({
//     presets: [
//         'hel',
//         ['h', {}],
//     ],
// });