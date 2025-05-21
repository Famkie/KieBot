// logger.js
const chalk = require('chalk');

const timestamp = () => {
  return new Date().toISOString();
};

const log = (type, message) => {
  let logMessage = `[${timestamp()}] `;

  switch (type) {
    case 'info':
      logMessage += chalk.blue('[INFO] ') + message;
      break;
    case 'warn':
      logMessage += chalk.yellow('[WARN] ') + message;
      break;
    case 'error':
      logMessage += chalk.red('[ERROR] ') + message;
      break;
    case 'event':
      logMessage += chalk.magenta('[EVENT] ') + message;
      break;
    case 'command':
      logMessage += chalk.green('[COMMAND] ') + message;
      break;
    default:
      logMessage += message;
      break;
  }

  console.log(logMessage);
};

module.exports = { log };
