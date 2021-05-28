// export interface ContainerCtx {
//     cwd: string;
// }
import { Context } from '../bin/tpl-create';

export { Context };

class Container {
    ctx: Context

    constructor(ctx: Context) {
        this.ctx = ctx;
    }
}

export default Container;