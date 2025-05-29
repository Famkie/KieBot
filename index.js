import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from './config/config.js';
import { loadCommands, handleInteraction, handleMessage } from './alerts/command_handlers/commandHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Keepalive server supaya bot gak disconnect di hosting
const app = express();
app.get('/', (_, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Keepalive aktif di port 3000'));

// Setup client Discord.js
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.aliases = new Collection();

async function main() {
  // Load semua commands dari folder commands
  await loadCommands(client, path.join(__dirname, 'commands'));

  // Load semua events dari folder events (async version)
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = (await fs.readdir(eventsPath)).filter(f => f.endsWith('.js'));

  for (const file of eventFiles) {
    const eventPath = path.join(eventsPath, file);
    const { default: event } = await import(`file://${eventPath}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  // Event interactionCreate untuk slash commands
  client.on('interactionCreate', interaction => handleInteraction(interaction, client));

  // Event messageCreate untuk prefix commands
  client.on('messageCreate', message => handleMessage(message, client, config.prefix || '!'));

  // Login ke Discord
  await client.login(config.token);
}

main().catch(console.error);
