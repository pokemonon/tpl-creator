import { getJsonData } from '@pokemonon/knife';

import { Opts } from '../bin/tpl-create';
import { formatConfig } from './lib/utils';

// 用户配置数据结构
export type PresetConfig = string | [string, Record<string, unknown>];
export type PluginConfig = string | [string, Record<string, unknown>];
export interface Config {
    presets?: PresetConfig[];
    plugins?: PluginConfig[];
}
export const defineConfig = (config: Config) => config;

// 格式化
export type PresetConfigArr = [string, Record<string, unknown>];
export type PluginConfigArr = [string, Record<string, unknown>];
export interface ConfigArr {
    presets?: PresetConfigArr[];
    plugins?: PluginConfigArr[];
}
// 加载配置信息
export const loadConfig = (opts: Opts) => {
    const config: ConfigArr = {};
    if (opts.config) {
        // 配置文件处理

    } else {
        let presets;
        if (opts.inlinePreset) {
            presets = opts.inlinePreset.map(p => getJsonData(p, ''));
        } else if (opts.preset) {
            presets = opts.preset;
        }
        config.presets = formatConfig(presets);

        let plugins;
        if (opts.inlinePlugin) {
            plugins = opts.inlinePlugin.map(p => getJsonData(p, ''));
        } else if (opts.plugin) {
            plugins = opts.plugin;
        }
        config.plugins = formatConfig(plugins);
    }

    return config;
};

defineConfig({
    presets: [
        'hel',
        ['h', {}],
    ],
});