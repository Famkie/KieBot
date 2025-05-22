import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

import config from './config/config.js';
import log from './utils/logger.js';

// === Init ===
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Keep Alive (Opsional) ===
const app = express();
app.get('/', (_, res) => res.send('Bot is running!'));
app.listen(3000, () => log.info('Keepalive aktif di port 3000'));

// === Client Setup ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// === Collection untuk semua jenis command ===
client.commands = new Collection();        // Slash commands
client.prefixCommands = new Collection();  // Prefix commands
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.contextMenus = new Collection();

// === Auto Load Handlers ===
const handlerPath = path.join(__dirname, 'handlers');
const handlerFiles = readdirSync(handlerPath).filter(file => file.endsWith('.js'));

for (const file of handlerFiles) {
  const { default: handler } = await import(path.join(handlerPath, file));
  await handler(client);
  log.info(`Handler ${file} dimuat.`);
}

log.info('Semua handler berhasil dimuat.');

// === Jalankan Bot ===
client.login(config.token)
  .then(() => log.info(`Bot berhasil login sebagai ${client.user?.tag || 'Unknown'}`))
  .catch((err) => log.error(`Gagal login: ${err.message}`));
