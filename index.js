import fs from 'fs';
import path from 'path';
import express from 'express';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import config from './config/config.js';
import log from './utils/logger.js';

dotenv.config();

// === Keep Alive (opsional) ===
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
import('./handlers/commandHandler.js').then(module => {
  module.default(client);
  log.info(`Loaded ${client.commands.size} commands.`);
}).catch(err => {
  log.error('Gagal memuat command handler:', err.message);
});

// === Load Events ===
const eventsPath = './events';
fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')).forEach(async file => {
  const { default: event } = await import(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => {
      log.info(`Event loaded (once): ${event.name}`);
      event.execute(...args, client);
    });
  } else {
    client.on(event.name, (...args) => {
      log.info(`Event loaded: ${event.name}`);
      event.execute(...args, client);
    });
  }
});

log.info('Menyiapkan interaction handler...');
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    log.warn(`Command tidak ditemukan: ${interaction.commandName}`);
    return;
  }

  log.info(`${interaction.user.tag} menjalankan command /${interaction.commandName}`);

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
