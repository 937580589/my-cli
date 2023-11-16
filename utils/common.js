const ora = require('ora');

// loading效果
const fnLoadingByOra = async (fn, message) => {
    const spinner = ora(message);
    spinner.start();
    let result = await fn();
    spinner.succeed(); // 结束loading
    return result; }
module.exports = {
    mapActions,
    fnLoadingByOra
};
