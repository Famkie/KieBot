// handlers/loadPrefixCommands.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  const basePath = path.join(__dirname, '..', 'commands', 'prefix');
  const folders = fs.readdirSync(basePath);

  for (const folder of folders) {
    const files = fs.readdirSync(path.join(basePath, folder)).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(basePath, folder, file);
      const commandModule = await import(filePath);
      const command = commandModule.default || commandModule;

      if (command?.name && typeof command.execute === 'function') {
        client.prefixCommands.set(command.name, command);
        console.log(`[PrefixCommand] Loaded: ${command.name}`);
      }
    }
  }
};
