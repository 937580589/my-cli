import fs, { emptyDir } from 'fs-extra';
import process from 'process';
import path from 'path';

export const checkDir = (target,dirName) => {
    if(fs.existsSync(target)){
            if(fs.readdirSync(target).length > 0){
                console.log(`${dirName}文件夹存在且不为空`)
            return true
        }
        console.log(`${dirName}为空文件夹`)
        return false;
    }
    return false
}

export const clearDir = (target) => {
    fs.emptydirSync(target)
}

export const removeDir = (target) => {
    fs.removeSync(target)
}

export const createDir = (target) => {
    fs.mkdirSync(target)
}

export const errorMessage = (message) => {
    console.log(message)
}

export const readJsonFileSync = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`无法读取 ${filePath} 文件：`, error);
        process.exit(1);
    }
}
