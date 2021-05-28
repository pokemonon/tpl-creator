import Creator from './Creator';
import { Context } from '../bin/tpl-create';
import { loadConfig } from './config';

export const create = (ctx: Context) => {
    const {
        appName,
        appPath,
        cwd,
        opts,
    } = ctx;

    const config = loadConfig(opts);
    const creator = new Creator(ctx);
    creator.create(config);
};
