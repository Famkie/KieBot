// utils/logger.js
const chalk = require('chalk');

const log = {
  info: (...args) => console.log(chalk.blue('[INFO]'), ...args),
  warn: (...args) => console.log(chalk.yellow('[WARN]'), ...args),
  error: (...args) => console.log(chalk.red('[ERROR]'), ...args),
  event: (...args) => console.log(chalk.magenta('[EVENT]'), ...args),
  command: (...args) => console.log(chalk.green('[COMMAND]'), ...args),
};

module.exports = { log };
