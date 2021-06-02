// export interface ContainerCtx {
//     cwd: string;
// }
// import { Context } from '../bin/tpl-create';

// export { Context };
export interface Context {
    appName: string;
    appPath: string;
    cwd: string;
    opts: any;
}

class Container {
    ctx: Context

    constructor(ctx: Context) {
        this.ctx = ctx;
    }
}

export default Container;