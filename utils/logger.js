// utils/logger.js
import chalk from 'chalk';

const log = {
  info: (...args) => console.log(chalk.blue('[INFO]'), ...args),
  warn: (...args) => console.log(chalk.yellow('[WARN]'), ...args),
  error: (...args) => console.log(chalk.red('[ERROR]'), ...args),
};

export default log;
