import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { clientId, guildId, token } from '../../../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'ready',
  once: true,

  async execute(client) {
    console.log(`✅ Bot ${client.user.tag} sudah online!`);
    client.user.setActivity('/help | KieBot', { type: 'PLAYING' });

    // AUTO DEPLOY SLASH COMMAND
    const commands = [];
    const slashFolderPath = path.join(__dirname, '../../../commands/slash');
    const commandFolders = fs.readdirSync(slashFolderPath);

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(slashFolderPath, folder))
        .filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(slashFolderPath, folder, file);
        const command = await import(filePath);
        if (command?.data && command?.execute) {
          commands.push(command.data.toJSON());
        }
      }
    }

    const rest = new REST({ version: '10' }).setToken(token);
    try {
      console.log('🚀 Deploying slash commands...');
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log('✅ Slash commands deployed successfully!');
    } catch (err) {
      console.error('❌ Gagal deploy slash commands:', err);
    }
  }
};
