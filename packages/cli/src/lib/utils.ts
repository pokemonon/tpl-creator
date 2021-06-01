import { isArray } from '@pokemonon/knife';

export const isLocalSource = (p: string) => /\.|\//.test(p);

