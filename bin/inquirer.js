import inquirer from "inquirer";
import axios from "axios";
import ora from 'ora';
import process from 'process';
import { promisify } from 'util'
import { exec, spawnSync } from 'child_process'
import path from 'path';
import chalk from 'chalk';
import { clearDir, errorMessage,installDep,readJsonFileSync,writeFileSync } from './common.js';
import { mapLanguage } from './prompts.js'

const getTemplateList = async () => {
    const spinner = ora('读取模版中...').start();
    try {
        const response = await axios.get("https://api.github.com/user/repos", {
            headers: {
                Authorization:
                "token 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",
            },
        });
        spinner.succeed("模版读取成功！")
        return response.data;
    } catch (error) {
        spinner.fail("模版读取失败！");
        throw error;
    }
};

export const overWriteInquirer = (targetPath) => {
    const dirName = path.basename(targetPath)
    inquirer.prompt([
        {
            type:'confirm',
            name: 'overWrite',
            message: '是否覆盖文件夹的内容'
        }
    ]).then( async ({overWrite}) => {
        if(overWrite){
            await clearDir(targetPath)
            selectTemplateInquirer(dirName)
            return;
        } else {
            errorMessage(`\r\n ${chalk.red('退出')} \r\n`)
            process.exit();
        }
    })
}

export const selectTemplateInquirer = (name) => {
    inquirer.prompt([
        {
            type: "confirm",
            name: "isTemplate",
            message: "是否使用现有模版",
        },
    ]).then(answers => {
        inquirerList(answers,name)
    })
}




/**
 * 克隆项目
 * @param {string} url 
 * @param {string} targetPath 
 */
const cloneTemplate = async (url, targetPath) => {
    const spinner = ora('正在下载模版中...').start();

    async function downloadTemplate() {
        try {
            await exec(`git clone ${url} ${targetPath}`);
            // spinner.stopAndPersist({
            //     symbol: '✅',
            //     text: '模版下载完成'
            // });
            spinner.succeed('模版下载完成...');
            return true;
        } catch (err) {
            spinner.fail('模版下载失败...');
            return false;
        }
    }
    
    downloadTemplate(url)
        .then(() => {
            console.log(`模版已下载至：${targetPath}`);
            // 在这里添加后续操作
        }).catch((error) => {
            console.error('模版下载过程中出现错误:', error);
        });
        
}


const inquirerList = async (prop,name) => {
    if(prop.isTemplate){
        const list  = await getTemplateList()
        const nameList = list.map(d => d.name)
        inquirer.prompt([
            {
                // when: (answers) => answers.isTemplate,
                type: "list",
                name: "template",
                message: "请选择模版",
                choices: nameList,
            }
        ])
        .then(({ template })=>{
            const storeInfo = list.find(d=> d.name===template)
            let templatePath = path.resolve(process.cwd(), name);
            cloneTemplate(storeInfo.clone_url, templatePath)
            const dirPath = path.resolve(process.cwd(), name)
            setTimeout(async ()=>{
                console.log('准备安装依赖...')
                installDep(void 0, dirPath)
            },2000)
        })
        // .then(()=>{
        //     const dirPath = path.resolve(process.cwd(), name)
        //     readJsonFileSync(dirPath,'package.json')
        //     installDep(void 0, dirPath)
        // })
    }else{
        inquirer.prompt([
            {
                // when: (answers) => !answers.isTemplate,
                type: "list",
                name: "language",
                message: "请选择新建工程的语言",
                choices: ["React", "Vue"],
            },
        ]).then((answers)=>{
            const dirPath = path.resolve(process.cwd(), name);
            const depList = mapLanguage[answers.language]
            if(depList){
                installDep(depList, dirPath)
            }
        })
    }
}