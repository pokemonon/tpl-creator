#! /usr/bin/env node
// import program from 'commander';
import { program } from 'commander';

import { version } from '../package.json';

program
    .version(version)
    .command('create <appName>', '创建项目')
    .command('add', '使用插件')
    .command('p <appName>', '创建插件开发模板')
    .parse(process.argv);
