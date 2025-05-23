// handlers/loadSlashCommands.js
import path from 'path';
import log from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  const categories = ['general', 'giveaway']; // Tambahkan kategori lain kalau perlu
  const baseDir = path.join(__dirname, '../interactions/slash');

  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);

    try {
      const commandFiles = ['start.js', 'end.js', 'cancel.js']; // ganti sesuai file real
      for (const file of commandFiles) {
        const filePath = path.join(categoryPath, file);
        const { default: command } = await import(filePath);

        if (!command?.data || !command?.execute) {
          log.warn(`[SlashLoader] Command di ${file} tidak valid`);
          continue;
        }

        client.commands.set(command.data.name, command);
        log.info(`[SlashLoader] Loaded: ${command.data.name}`);
      }
    } catch (err) {
      log.error(`[SlashLoader] Error load kategori ${category}: ${err.message}`);
    }
  }
};
