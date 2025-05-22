import path from 'path';
import { readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import log from '../utils/logger.js';

// Mendapatkan __dirname dengan ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk scan folder rekursif
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
  // Gunakan __dirname sebagai acuan yang benar
  const slashDir = path.join(__dirname, '../interactions/slash');
  
  let commandFiles = [];
  try {
    commandFiles = loadFiles(slashDir);
  } catch (err) {
    log.error(`Folder slash commands tidak ditemukan: ${slashDir}`);
    return;
  }

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
