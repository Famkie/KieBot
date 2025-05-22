// deploy/deploy-commands.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REST, Routes } from 'discord.js';
import { clientId, guildId, token } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const slashFolderPath = path.join(__dirname, '../commands/slash');
const commandFolders = fs.readdirSync(slashFolderPath);

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(path.join(slashFolderPath, folder))
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(slashFolderPath, folder, file);
    const commandModule = await import(filePath);
    const command = commandModule.default || commandModule;
    if (command?.data && command?.execute) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`⚠️  Skipping invalid command file: ${file}`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('🚀 Deploying slash commands to guild...');
  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );
  console.log('✅ Slash commands deployed successfully!');
} catch (error) {
  console.error('❌ Failed to deploy slash commands:', error);
}
