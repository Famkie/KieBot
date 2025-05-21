const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
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
})();