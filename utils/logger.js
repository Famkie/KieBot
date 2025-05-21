const chalk = require('chalk');

const timestamp = () => new Date().toISOString();

const log = (type, message) => {
  const prefixMap = {
    info: chalk.blue('[INFO]'),
    warn: chalk.yellow('[WARN]'),
    error: chalk.red('[ERROR]'),
    event: chalk.magenta('[EVENT]'),
    command: chalk.green('[COMMAND]')
  };

  const prefix = prefixMap[type] || '';

  console.log(`[${timestamp()}] ${prefix} ${message}`);
};

module.exports = { log };
