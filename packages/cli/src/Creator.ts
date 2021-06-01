import { ConfigArr, getRequiredConfig, PluginConfigArr, PresetConfigArr } from './config';
import Container, { Context } from './Container' ;
import { Plugin, PluginsAPI } from './plugins';
import { PresetsAPI, Preset, PresetResultArr } from './presets';

export type PreConfigArr = [typeof Preset, Record<string, unknown>?]
export type PluConfigArr = [typeof Plugin, Record<string, unknown>?]

export default class Creator extends Container {
    constructor(ctx: Context) {
        super(ctx);
    }

    // 开始处理配置 生成模板
    async create(config: ConfigArr) {
        const { presets, plugins } = config;

        // todo 处理presets
        let presetResultArr: PresetResultArr = {};

        if (presets) {
            // 安装presets
            // const needIns: string[] = [];
            // presets.forEach(p => {
            //     const [presetName] = p;
            //     const isLocalPreset = isLocalSource(presetName);
            //     if (!isLocalPreset) {
            //         needIns.push(presetName);
            //     }
            // });
            // needIns.length && await pkg.add(needIns);

            // const preConfigs: PreConfigArr[] = presets.map(p => {
            //     const [presetName, presetOpts] = p;
            //     const P = require(isLocalSource(presetName) ? path.resolve(this.ctx.cwd, presetName) : pkg.resolve(presetName));
            //     // return isArray(p) ? [P, p[1]] : [P];
            //     return [P, presetOpts];
            // });
            const preConfigs = await getRequiredConfig<PresetConfigArr, PreConfigArr>(this.ctx, presets);
            
            const presetAPI = new PresetsAPI(this.ctx, preConfigs);
            // 命令行交互
            await presetAPI.prompt();

            // 初始化preset
            await presetAPI.load();
            
            presetResultArr = presetAPI.getPresetResultArr();
        }
        
        // todo 拿到presets的结果，处理plugins
        // todo 1. 安装
        if (plugins || presetResultArr.plugins) {
            // const needIns: string[] = [];
            // plugins.forEach(p => {
            //     // const pluginName = isArray(p) ? p[0] : p;
            //     const [pluginName] = p;
            //     const isLocalPlugin = isLocalSource(pluginName);
            //     if (!isLocalPlugin) {
            //         needIns.push(pluginName);
            //     }
            // });
            // needIns.length && await pkg.add(needIns);

            
            // const pluConfigs: PluConfigArr[] = plugins.map(p => {
            //     // const pluginName = isArray(p) ? p[0] : p;
            //     const [pluginName, pluginOpt] = p;
            //     const P = require(isLocalSource(pluginName) ? path.resolve(this.ctx.cwd, pluginName) : pkg.resolve(pluginName));
            //     // return isArray(p) ? [P, p[1]] : [P];
            //     return [P, pluginOpt];

            // });
            const pluConfigs = plugins ?
                await getRequiredConfig<PluginConfigArr, PluConfigArr>(this.ctx, plugins) :
                [];

            // 处理预设内部的插件
            // const pluginsInPreset: PluConfigArr[] = (presetResult.plugins || []).map(i => {
            //     return isArray(i) ? i : [i];
            // });
            const pluginsInPreset = presetResultArr.plugins || [];

            const pluginAPI = new PluginsAPI(this.ctx, [
                // ...(presetResult.plugins || []),
                ...pluginsInPreset,
                ...pluConfigs,
            ]);
            // 命令行交互
            await pluginAPI.prompt();

            // 初始化preset
            await pluginAPI.load();
        }
    }
}
