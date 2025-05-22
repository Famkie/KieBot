import path from 'path';
import { fileURLToPath } from 'url';
import log from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  try {
    const modalFiles = [
      '../interactions/modals/feedbackModal.js',
      // Tambahkan modal lainnya di sini kalau ada
    ];

    for (const filePath of modalFiles) {
      const fullPath = path.join(__dirname, filePath);
      const modal = (await import(fullPath)).default;

      if (!modal?.customId || !modal?.execute) {
        log.warn(`[Modal] ${filePath} tidak valid!`);
        continue;
      }

      client.modals.set(modal.customId, modal);
      log.info(`[Modal] Loaded: ${modal.customId}`);
    }
  } catch (err) {
    log.error(`[Modal] Error saat load modal: ${err.message}`);
  }
};
