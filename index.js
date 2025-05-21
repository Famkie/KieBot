const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const config = require('./config/config.js');

// === Keep Alive (opsional) ===
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Keepalive aktif di port 3000'));

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

// === Load Command Handler ===
require('./handlers/commandHandler')(client);

// === Load Events (jika ada) ===
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// === Interaction Handler ===
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error('Error executing command:', err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Terjadi error saat menjalankan command.', ephemeral: true });
    }
  }
});

// === Jalankan Bot ===
client.login(config.token);
