import * as path from 'path';

import { ItemOrArray } from '@pokemonon/knife/types/common';
import { PackageManager } from '@pokemonon/knife/node';
// import execa from 'execa';

export const TPL_CREATOR_DIR = path.resolve(process.env.HOME!, '.tpl-creator');
// export const pkgResolve = (...p: string[]) => path.resolve(TPL_CREATOR_DIR, ...p);
// export const pkgManager = new PackageManager({ context: TPL_CREATOR_DIR });

// export const installDep = (deps: string[]) => {
//     pkgManager.add(deps);
// };

class Pkg {
    dir!: string
    pkgManager!: PackageManager

    constructor(dir = TPL_CREATOR_DIR) {
        this.dir = dir;
        this.pkgManager = new PackageManager({ context: dir });
    }

    resolve(...p: string[]) {
        return path.resolve(this.dir, ...p);
    }

    add(deps: ItemOrArray<string>) {
        this.pkgManager.add(deps);
    }
}

export default new Pkg();