#! /usr/bin/env node
import program from 'commander';

import { version } from '../package.json';

program
    .version(version)
    .command('create <appName>', '创建项目')
    .parse(process.argv);

