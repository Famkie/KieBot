const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const config = require('./config/config.js');

// Import logger (pakai object dengan method: info, warn, error, dst)
const { log } = require('./utils/logger');

// === Keep Alive (opsional) ===
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => log.info('Keepalive aktif di port 3000'));

// === Client Setup ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

log.info('Memulai load command handler...');

// === Load Command Handler ===
require('./handlers/commandHandler')(client);
log.info(`Loaded ${client.commands.size} commands.`);

// === Load Events ===
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => {
      log.event(`Event loaded (once): ${event.name}`);
      event.execute(...args, client);
    });
  } else {
    client.on(event.name, (...args) => {
      log.event(`Event loaded: ${event.name}`);
      event.execute(...args, client);
    });
  }
}

log.info('Menyiapkan interaction handler...');
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    log.warn(`Command tidak ditemukan: ${interaction.commandName}`);
    return;
  }

  log.command(`${interaction.user.tag} menjalankan command /${interaction.commandName}`);

  try {
    await command.execute(interaction);
  } catch (err) {
    log.error(`Error executing command /${interaction.commandName}: ${err.message}`);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Terjadi error saat menjalankan command.', ephemeral: true });
    }
  }
});

// === Jalankan Bot ===
client.login(config.token)
  .then(() => log.info('Bot berhasil login dan siap digunakan!'))
  .catch(err => log.error(`Gagal login: ${err.message}`));
