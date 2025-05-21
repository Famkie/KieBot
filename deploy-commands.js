import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  const commandFolders = fs.readdirSync(path.join(__dirname, '..', 'commands'));

  for (const folder of commandFolders) {
    const folderPath = path.join(__dirname, '..', 'commands', folder);

    if (fs.lstatSync(folderPath).isDirectory()) {
      const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        try {
          const commandModule = await import(filePath);
          const command = commandModule.default || commandModule;
          if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            console.log(`[Command] Loaded: ${command.data.name}`);
          }
        } catch (error) {
          console.error(`Failed to load command at ${filePath}:`, error);
        }
      }
    }
  }
};
