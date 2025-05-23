import path from 'path';
import { fileURLToPath } from 'url';
import log from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  const folders = ['giveaway']; // Sesuaikan dengan folder di interactions/slash

  for (const folder of folders) {
    try {
      const filePaths = [
        // Tambahkan file JS di folder itu secara eksplisit
        `../interactions/slash/${folder}/start.js`,
        // Tambah sesuai kebutuhan
      ];

      for (const filePath of filePaths) {
        const fullPath = path.join(__dirname, filePath);
        const command = (await import(fullPath)).default;

        if (!command?.data || !command?.execute) {
          log.warn(`[SlashCommand] ${filePath} tidak valid!`);
          continue;
        }

        client.commands.set(command.data.name, command);
        log.info(`[SlashCommand] Loaded: ${command.data.name}`);
      }
    } catch (err) {
      log.error(`[SlashCommand] Error saat load ${folder}: ${err.message}`);
    }
  }
};
