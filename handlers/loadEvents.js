import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// FIX UNTUK ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  const eventsPath = path.join(__dirname, '..', 'events');
  const folders = fs.readdirSync(eventsPath);

  for (const folder of folders) {
    const folderPath = path.join(eventsPath, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const eventModule = await import(filePath);
      const event = eventModule.default;

      if (event?.name && typeof event.execute === 'function') {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
          client.on(event.name, (...args) => event.execute(client, ...args));
        }
      }
    }
  }
};
