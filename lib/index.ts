#! /usr/bin/env node

import * as fs from 'fs';
import * as readline from 'readline';

export function remover(deep?: boolean) {

    let folders : string[] = [];

    if(deep) {
        folders = listAllNodeModulesDeep(process.cwd())
            .map( e => e.replace('node_modules', ''));
    } else {
        folders = listAllNodeModules();
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('You have this: ');
    console.log(folders);

    rl.question('Do you want to remove this directory? (y/n) ', (answer) => {
        if (answer === 'yes' || answer == 'y') {
            folders.forEach((directory) => deleteFolder(`${directory}/node_modules`));
            console.log('\n success! :D ');
            rl.close();
        } else {
            console.log('Have a nice day! :D');
        }
    });
}

/**
 * @description Listagem de todos os node_modules dos subdiretórios de um diretório.
 */
export const listAllNodeModules = () : string [] => {
    return fs.readdirSync(process.cwd())
        .map((element) => `${process.cwd()}/${element}`)
        .filter((element) => fs.statSync(element).isDirectory())
        .filter((directory) => fs.existsSync(`${directory}/node_modules`));
};

/**
 * função recursiva. Se não existe nenhuma node_modules na pasta, entrar nas subpastas;
 * @description Retorna Array de node_modules de subpastas
 */
export const listAllNodeModulesDeep = (path: string) : string [] => {

    let all = [];

    const paths = fs.readdirSync(path)
        .map((element) => `${path}/${element}`);

    paths.forEach(path => {
        if (fs.lstatSync(path).isDirectory()) {
            const newPath = `${path}/node_modules`;
            if (fs.existsSync(newPath)) {
                all.push(newPath);
            } else {
                all = all.concat(listAllNodeModulesDeep(path));
            }
        }
    });

    return all;
};

/**
 * Função recursiva; Se é diretório irá fazer recursão. Caso contrário irá excluir o arquivo.
 * @description Exclusão de todos os arquivos de um diretório.
 */
const deleteFolder = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory())
                deleteFolder(curPath);
            else {
                fs.unlinkSync(curPath);
                printRemovedFile(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

/**
 * @description Print da remoção de um arquivo.
 */
const printRemovedFile = (file) => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    let text = `Removed file:  ${file}`;
    process.stdout.write(text);
};


