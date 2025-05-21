import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Buat __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (client) => {
  const commandFolders = fs.readdirSync(path.join(__dirname, '..', 'commands'));

  for (const folder of commandFolders) {
    const folderPath = path.join(__dirname, '..', 'commands', folder);

    if (fs.lstatSync(folderPath).isDirectory()) {
      const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        // Import dinamis di ESM harus pakai import(), jadi ini promise
        import(filePath).then((commandModule) => {
          const command = commandModule.default || commandModule;
          if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            console.log(`[Command] Loaded: ${command.data.name}`);
          }
        }).catch(console.error);
      }
    }
  }
};
