import fs, { emptyDir } from 'fs-extra';
import process from 'process';
import path from 'path';
import { overWriteInquirer, selectTemplateInquirer  } from './inquirer.js';
import chalk from 'chalk';
import { spawnSync } from 'child_process';


export const checkDir = async (targetPath) => {
    // 检查文件夹是否存在
    const exists = await fs.pathExists(targetPath);
    const fileName = path.basename(targetPath)
    if (!exists) {
        // console.log(`Folder ${targetPath} does not exist.`);
        console.log(`${fileName} 文件夹不存在，将自动执行创建文件夹`)
        createDir(targetPath)
        return null;
    }

    // 检查文件夹是否为空
    const files = fs.readdirSync(targetPath);
    if (files.length === 0) {
        // console.log(`Folder ${targetPath} is empty.`);
        console.log(`${fileName} 为空文件夹`)
        return 0
    } else {
        // console.log(`Folder ${targetPath} is not empty.`);
        console.log(`${fileName} 文件夹内不为空，内部文件如下:`, files);
        return files.length;
    }
}
// export const checkDir = (target,dirName) => {
//     if(fs.existsSync(target)){
//             if(fs.readdirSync(target).length > 0){
//                 console.log(`${dirName}文件夹存在且不为空`)
//             return true
//         }
//         console.log(`${dirName}为空文件夹`)
//         return false;
//     }
//     return false
// }

export const clearDir = (target) => {
    try{
        fs.emptydirSync(target)
        console.log('清除文件夹内容')
    }catch(err){
        errorMessage(`清空文件夹失败 ${chalk.red('程序退出')}`)
        process.exit()
    }
}

export const removeDir = (target) => {
    fs.removeSync(target)
}

export const createDir = (target) => {
    try{
        fs.mkdirSync(target)
        console.log('文件夹创建成功')
    }catch(err){
        errorMessage(`文件夹创建失败 ${chalk.red('程序退出')}`)
        process.exit()
    }
}

export const errorMessage = (message) => {
    console.log(message)
}

export const readJsonFileSync = (filePath,name) => {
    try {
        const data = fs.readFileSync(path.resolve(filePath,name), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`无法读取 ${filePath} 文件：`);
        process.exit(1);
    }
}

export const writeFileSync = (name, data)=>{
    try{
        fs.writeFileSync(name, data, 'utf8');
    }catch(error) {
        console.log('写入失败')
        process.exit()
    }
}

export const mapAction = {
    'create <name>': {
        alias: 'c',
        description: '创建一个新工程',
        action: async (name) => {
            console.log('[工程名称] >', name)
            const cwd = process.cwd()
            const targetPath = path.resolve(cwd, name);
            const length = await checkDir(targetPath)
            // if(length){
            //     await clearDir(targetPath)
            //     await checkDir(targetPath)
            // }
            if(length){
                overWriteInquirer(targetPath)
            }else{
                selectTemplateInquirer(name)
            }
        }
    },

}


/**
 * 
 * @param {string[]} argv 安装的包(数组)
 */
export const installDep = (argv, dirPath) => {
    const command = argv ? ['install'].concat(argv) : ['install']
    const ret = spawnSync('pnpm', command, { cwd: dirPath,stdio: 'inherit'})
    if(ret.status !== 0 ){
        throw Error('依赖安装失败')
    }else{
        console.log('依赖安装成功')
    }
}