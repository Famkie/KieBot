import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  client.modals = new Map();

  const modalsPath = path.join(__dirname, '..', 'interactions', 'modals');
  if (!fs.existsSync(modalsPath)) {
    console.warn('[Modal] Folder modals belum ada, buat dulu ya di:', modalsPath);
    return;
  }

  const files = fs.readdirSync(modalsPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    try {
      const filePath = path.join(modalsPath, file);
      const modalModule = await import(filePath);
      const modal = modalModule.default || modalModule;

      if (modal.customId && typeof modal.execute === 'function') {
        client.modals.set(modal.customId, modal);
        console.log(`[Modal] Loaded: ${modal.customId}`);
      } else {
        console.warn(`[Modal] Invalid modal handler in file: ${file}`);
      }
    } catch (err) {
      console.error(`[Modal] Error loading ${file}:`, err);
    }
  }
}; 
