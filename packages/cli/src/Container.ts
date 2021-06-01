// export interface ContainerCtx {
//     cwd: string;
// }
// import { Context } from '../bin/tpl-create';

// export { Context };
export interface Context<Opts = Record<string, unknown>> {
    appName: string;
    appPath: string;
    cwd: string;
    opts: Opts;
}

class Container<Ctx = Record<string, unknown>> {
    ctx: Context<Ctx>

    constructor(ctx: Context<Ctx>) {
        this.ctx = ctx;
    }
}

export default Container;