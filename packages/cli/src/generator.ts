import * as path from 'path';

import { readdirSync, statSync , readFileSync, mkdirpSync } from 'fs-extra';
import globby from 'globby';
import { loadFront } from 'yaml-front-matter';
import { locateCallFile, writeFile } from '@pokemonon/knife/node';
import { sureArray } from '@pokemonon/knife';
import { render as ejsRender } from 'ejs';

import Container, { Context } from './Container';

const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/;
const emptyBlckRE = /<%# Empty %>([^]*?)<%# Empty %>/;
const EmptyDir = '__EMPTY_DIR__';

export class GeneratorAPI extends Container {
    files: Record<string, string> = {}

    constructor(ctx: Context) {
        super(ctx);
        this.resolveFiles();
    }

    // 加载文件信息
    resolveFiles() {
        // todo 文件多大过多？
        // todo 排除不必要的文件
        const filePaths = globby.sync(['**/*'], {
            cwd: this.ctx.appPath,
            gitignore: true,
            // onlyFiles: false
        });
        filePaths.forEach(p => {
            const targetPath = path.resolve(this.ctx.appPath, p);
            this.files[targetPath] = readFileSync(targetPath, { encoding: 'utf-8' });
        });
    }


    render(source: string, additionData = {}, ejsOptions = {}) {
        const callDir = path.dirname(locateCallFile(2));
        
        source = path.resolve(callDir, source);
        const data = this.resolveData(additionData);
        const filePaths = globby.sync(['**/*'], {
            cwd: source,
            dot: true,
            onlyFiles: false,
        });

        for (const filePath of filePaths) {
            const sourceFilePath = path.resolve(source, filePath);
            
            let targetPath = filePath.split(path.sep).map(p => {
                if (p[0] === '_' && p[1] !== '_') {
                    return `.${p.slice(1)}`;
                }
                if (p[0] === '_' && p[1] === '_') {
                    return p.slice(1);
                }
                return p;
            }).join(path.sep);
            targetPath = path.resolve(this.ctx.appPath, targetPath);

            const stats = statSync(sourceFilePath);
            // 文件夹
            if (stats.isDirectory()) {
                // 空文件夹
                if (!readdirSync(sourceFilePath).length) {
                    this.files[targetPath] = EmptyDir;
                }
                // return false;
                continue;
            }

            const content = this.renderFile(sourceFilePath, targetPath, data, ejsOptions);
            this.files[targetPath] = content;
        }
    }

    renderFile(sPath: string, tPath: string, data = {}, ejsOpts = {}) {
        const template = readFileSync(sPath, { encoding: 'utf-8' });
        const frontMatter = loadFront(template);
        const content = frontMatter.__content.trim();

        const tFile = this.files[tPath];
        let finalTpl = '';

        // 如果存在相同的文件
        if (tFile) {
            // finalTpl = readFileSync(tPath, { encoding: 'utf-8' });
            finalTpl = tFile;
            if (frontMatter.replace) {
                const replaceRegs: RegExp[] = sureArray(frontMatter.replace);

                const replaceMatch = content.match(new RegExp(replaceBlockRE, 'g'));
                const replaceStrs = replaceMatch ? replaceMatch.map(str => str.replace(replaceBlockRE, '$1').trim()) : content;
                
                replaceRegs.forEach((reg, i) => {
                    finalTpl = finalTpl.replace(reg, replaceStrs[i]);
                });
            } else {
                finalTpl = content;
            }
            // return finalTpl;
        } else {
            if (frontMatter.replace) {
                // 如果没有存在同名文件，则使用EmptyBlock部分
                if (content.match(emptyBlckRE)) {
                    // return content.match(emptyBlckRE)![1];
                    finalTpl = content.match(emptyBlckRE)![1];
                }
            } else {
                finalTpl = content;
            }
        }

        // return content;
        const info = this.resolveData(data);
        return ejsRender(finalTpl, info, ejsOpts);
        // if (tFile) {
        //     const 
        // }
        // if (frontMatter.replace) {
        //     const replaceRegs: RegExp[] = sureArray(frontMatter.replace)

        //     const replaceMatch = content.match(new RegExp(replaceBlockRE, 'g'));
        //     const replaceStrs = replaceMatch ? replaceMatch.map(str => str.replace(replaceBlockRE, '$1').trim()) : content;
            
        //     replaceRegs.forEach((reg, i) => {

        //     })
        // }
    }

    generate() {
        // writeFiles(this.ctx.appPath, this.files);
        Object.keys(this.files).forEach(filePath => {
            const content = this.files[filePath];
            // filePath = path.resolve(this.ctx.appPath, filePath);
            if (content === EmptyDir) {
                mkdirpSync(filePath);
            } else {
                writeFile(filePath, content);
            }
        });
    }

    findFile(path: string) {
        return Object.keys(this.files).find(filePath => filePath.endsWith(path));
    }


    private resolveData(additionData = {}) {
        return {
            ctx: this.ctx,
            ...additionData,
        };
    }
}