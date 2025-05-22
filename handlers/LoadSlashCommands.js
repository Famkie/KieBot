// handlers/loadSlashCommands.js
import path from 'path';
import { readdirSync, statSync } from 'fs';
import log from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recursive function untuk ambil semua file .js/.ts
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
  const slashDir = path.join(__dirname, '..', 'interactions', 'slash');

  console.log('[DEBUG] SlashDir Path:', slashDir);

  const commandFiles = loadFiles(slashDir);

  for (const file of commandFiles) {
    console.log('[DEBUG] Loading file:', file); // Tambahkan log per file
    try {
      const commandModule = await import(file);
      const command = commandModule.default;

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
