import fs from 'fs/promises';
import path from 'path';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deployCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');
  const commandFolders = await fs.readdir(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = (await fs.readdir(folderPath)).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const commandModule = await import(`file://${filePath}`);
      const command = commandModule.default || commandModule;

      if (command.data) {
        commands.push(command.data.toJSON());
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('⏳ Mengupdate slash command...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash command berhasil diupdate.');
  } catch (err) {
    console.error('❌ Gagal update slash command:', err);
  }
}

deployCommands();
