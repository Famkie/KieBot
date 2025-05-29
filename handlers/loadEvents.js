// handlers/loadEvents.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  const eventsPath = path.join(__dirname, '..', 'events');

  if (!fs.existsSync(eventsPath)) {
    console.warn(`[WARNING] Folder events tidak ditemukan: ${eventsPath}`);
    return;
  }

  const folders = fs.readdirSync(eventsPath);

  for (const folder of folders) {
    const folderPath = path.join(eventsPath, folder);

    // Skip jika bukan folder
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        const eventModule = await import(filePath);
        const event = eventModule.default;

        if (event?.name && typeof event.execute === 'function') {
          if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
          } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
          }
        }
      } catch (err) {
        console.error(`[ERROR] Gagal load event file ${file}: ${err.message}`);
      }
    }
  }
};
 
