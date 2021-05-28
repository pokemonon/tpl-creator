import * as path from 'path';

import { readFileSync } from 'fs-extra';
import globby from 'globby';
import { loadFront } from 'yaml-front-matter';
import { locateCallFile, writeFiles } from '@pokemonon/knife/node';
import { sureArray } from '@pokemonon/knife';

import Container, { Context } from './Container';

const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/;
const emptyBlckRE = /<%# Empty %>([^]*?)<%# Empty %>/;

export class GeneratorAPI extends Container {
    files: Record<string, string> = {}

    constructor(ctx: Context) {
        super(ctx);
        this.resolveFiles();
    }

    // 加载文件信息
    resolveFiles() {
        const filePaths = globby.sync(['**/*'], { cwd: this.ctx.appPath });
        filePaths.forEach(p => {
            const targetPath = path.resolve(this.ctx.appPath, p);
            this.files[targetPath] = readFileSync(targetPath, { encoding: 'utf-8' });
        });
    }


    render(source: string, additionData = {}, ejsOptions = {}) {
        const callDir = path.dirname(locateCallFile(2));
        
        source = path.resolve(callDir, source);
        const data = this.resolveData(additionData);
        const filePaths = globby.sync(['**/*'], { cwd: source, dot: true });
        for (const filePath of filePaths) {
            const sourceFilePath = path.resolve(source, filePath);
            const targetPath = filePath.split(path.sep).map(p => {
                if (p[0] === '_' && p[1] !== '_') {
                    return `.${p.slice(1)}`;
                }
                if (p[0] === '_' && p[1] === '_') {
                    return p.slice(1);
                }
                return p;
            }).join(path.sep);
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
            return finalTpl;
        }

        if (frontMatter.replace) {
            if (content.match(emptyBlckRE)) {
                return content.match(emptyBlckRE)![1];
            }
        }
        return content;
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
        writeFiles(this.ctx.appPath, this.files);
    }


    private resolveData(additionData = {}) {
        return {
            ...additionData,
        };
    }
}