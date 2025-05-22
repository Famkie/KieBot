import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readdirSync, statSync } from 'fs';
import log from '../utils/logger.js';

// Absolute fallback ke root project jika semua gagal
const BASE_DIR = '/home/container';

const loadFiles = (dirPath) => {
  const files = [];
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...loadFiles(fullPath));
    } else if (item.endsWith('.js') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
};

export default async (client) => {
  const slashDir = path.join(BASE_DIR, 'interactions', 'slash');

  console.log('[DEBUG] Using fallback BASE_DIR:', BASE_DIR);
  console.log('[DEBUG] SlashDir Path:', slashDir);

  if (!fs.existsSync(slashDir)) {
    log.error(`Folder tidak ditemukan: ${slashDir}`);
    return;
  }

  const commandFiles = loadFiles(slashDir);

  for (const file of commandFiles) {
    try {
      const command = (await import(file)).default;
      if (!command?.data || !command?.execute) {
        log.warn(`Slash Command di ${file} tidak valid`);
        continue;
      }

      client.commands.set(command.data.name, command);
      log.info(`Loaded Slash Command: ${command.data.name}`);
    } catch (err) {
      log.error(`Gagal load Slash Command ${file}: ${err.message}`);
    }
  }
};
