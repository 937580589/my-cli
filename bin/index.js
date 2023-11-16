#! /usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import { Command } from 'commander';
import inquirer from "inquirer";
import process from 'process';
import path from 'path';
import { overWriteInquirer,selectTemplateInquirer } from './inquirer.js';
import { removeDir, checkDir, errorMessage } from './common.js'
const program = new Command();

program
    .on(
        '--help',
        () => {
            console.log('\r\n' + chalk.white.bgBlueBright.bold(figlet.textSync('My-cli', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default',
                width: 80,
                whiteSpaceBreak: true
            })))
            console.log(`\r\n Run ${chalk.cyan()} for detailed usage of given comman \r\n`)
        }
    )

program
    .name('my')
    .description('')
    .version('1.0.0')

program.command('create <name>')
    .alias('c')
    .description('创建一个新工程')
    .action((name) => {
        console.log('[ 工程名称 ] >', name)
        const cwd = process.cwd()
        const targetPath = path.resolve(cwd, name);
        new Promise((resolve)=>{
            resolve(checkDir(targetPath, name))
        })
        .then((d) => {
            if(d){
                overWriteInquirer(targetPath,name)
            }else{
                selectTemplateInquirer(name)
            }
            
        })
    });

program.parse(process.argv);