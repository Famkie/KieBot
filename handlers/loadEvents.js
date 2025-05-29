import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (client) => {
  const eventFolders = ['client', 'guild'];
  for (const folder of eventFolders) {
    const pathToEvents = join(__dirname, '../events', folder);
    for (const file of readdirSync(pathToEvents)) {
      const event = await import(join(pathToEvents, file));
      const eventName = file.split('.')[0];
      if (folder === 'client') client.on(eventName, (...args) => event.default(...args, client));
      else client.on(eventName, event.default);
      logger.info(`[Event] Loaded: ${eventName}`);
    }
  }
};
