import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const logDir = path.resolve('./log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

function getLogFileName() {
  const now = new Date();
  return path.join(logDir, `log_${now.toISOString().replace(/[:.]/g, '-')}.txt`);
}

function writeLogToFile(level, message) {
  const fileName = getLogFileName();
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  fs.writeFile(fileName, logMessage, (err) => {
    if (err) console.error(chalk.red('Gagal menulis log ke file:'), err);
  });
}

const log = {
  info: (...args) => {
    const msg = args.join(' ');
    console.log(chalk.blue('[INFO]'), ...args);
    writeLogToFile('info', msg);
  },
  warn: (...args) => {
    const msg = args.join(' ');
    console.log(chalk.yellow('[WARN]'), ...args);
    writeLogToFile('warn', msg);
  },
  error: (...args) => {
    const msg = args.join(' ');
    console.log(chalk.red('[ERROR]'), ...args);
    writeLogToFile('error', msg);
  },
};

export default log;
