import { isArray } from '@pokemonon/knife';

export const isLocalSource = (p: string) => /\.|\//.test(p);

export const formatItemConfig = <T, K = [T, Record<string, unknown>]>(config): K => isArray<any>(config) ? config : [config, {}];
export const formatConfig = <T>(config) => config.map((i) => formatItemConfig<T>(i));