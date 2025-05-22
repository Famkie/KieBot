import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

// === Load All Handlers ===
const handlerPath = path.join(__dirname, 'handlers');
const handlers = [
  'loadEvents.js',
  'loadPrefixCommands.js',
  'loadSlashCommands.js',
  'loadButtons.js',
  'loadModals.js',
  'loadSelectMenus.js',
  'loadContextMenus.js'
];

for (const file of handlers) {
  const handler = await import(path.join(handlerPath, file));
  await handler.default(client);
}

log.info('Semua handler berhasil dimuat.');

// === Jalankan Bot ===
client.login(config.token)
  .then(() => log.info(`Bot berhasil login sebagai ${client.user?.tag || 'Unknown'}`))
  .catch((err) => log.error(`Gagal login: ${err.message}`));
