const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials, Events, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const config = require('./config/config.js');

// === Keep Alive (optional, untuk Cybrancee/Replit) ===
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
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.aliases = new Collection();
client.giveaways = new Map(); // <- Tambahan: untuk menyimpan data giveaway aktif

// Load handler
require('./handlers/commandHandler')(client);

// === Load Commands ===
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if (!command.name) continue;

    client.commands.set(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => client.aliases.set(alias, command.name));
    }
  }
}

// === Load Events ===
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// === Listener Button Giveaway ===
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'join_giveaway') {
    const giveaway = client.giveaways.get(interaction.message.id);

    if (!giveaway) {
      return interaction.reply({ content: 'Giveaway tidak ditemukan atau sudah berakhir.', ephemeral: true });
    }

    if (giveaway.participants.has(interaction.user.id)) {
      return interaction.reply({ content: 'Kamu sudah ikut giveaway ini!', ephemeral: true });
    }

    giveaway.participants.add(interaction.user.id);
    return interaction.reply({ content: 'Berhasil ikut giveaway!', ephemeral: true });
  }
});

// === Start Bot ===
client.login(config.token);
