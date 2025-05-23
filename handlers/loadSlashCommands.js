// handlers/loadSlashCommands.js
import path from 'path';
import { readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import log from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rekursif scan semua file JS di folder
const loadFiles = (dirPath) => {
  let results = [];
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      results = results.concat(loadFiles(fullPath));
    } else if (item.endsWith('.js') || item.endsWith('.ts')) {
      results.push(fullPath);
    }
  }

  return results;
};

export default async (client) => {
  const slashDir = path.join(__dirname, '../interactions/slash');
  log.info(`[SlashLoader] Scanning slash commands di: ${slashDir}`);

  const commandFiles = loadFiles(slashDir);

  for (const file of commandFiles) {
    try {
      const commandModule = await import(file);
      const command = commandModule.default;

      if (!command?.data || typeof command.execute !== 'function') {
        log.warn(`[SlashLoader] Command tidak valid di ${file}`);
        continue;
      }

      client.commands.set(command.data.name, command);
      log.info(`[SlashLoader] Loaded: ${command.data.name}`);
    } catch (err) {
      log.error(`[SlashLoader] Gagal load ${file}: ${err.message}`);
    }
  }

  if (client.commands.size === 0) {
    log.warn('[SlashLoader] Tidak ada slash command yang berhasil dimuat.');
  }
};
