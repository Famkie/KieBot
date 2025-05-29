import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';
import chalk from 'chalk';
import { pathToFileURL } from 'url';
import config from '../../config/config.js';

export async function loadCommands(client, commandsDir) {
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.aliases = new Collection();

  const commandFolders = fs.readdirSync(commandsDir);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const commandModule = await import(pathToFileURL(filePath).href);
        const command = commandModule.command || commandModule.default || {};
        const slashData = commandModule.data;

        const isPrefixCommand = typeof command.execute === 'function';
        const isSlashCommand = slashData && typeof command.slash === 'function';

        if (isPrefixCommand) {
          client.commands.set(command.name, command);
          if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
              client.aliases.set(alias, command.name);
            }
          }
          console.log(chalk.green(`[PREFIX] Loaded: ${command.name}`));
        }

        if (isSlashCommand) {
          client.slashCommands.set(slashData.name, { data: slashData, execute: command.slash });
          console.log(chalk.cyan(`[SLASH] Loaded: ${slashData.name}`));
        }

        if (!isPrefixCommand && !isSlashCommand) {
          console.warn(chalk.yellow(`[WARN] Skipped invalid command file: ${file}`));
        }
      } catch (error) {
        console.error(chalk.red(`[ERROR] Failed to load command ${file}:`), error);
      }
    }
  }
}

export async function deploySlashCommands(clientId, guildId, client, token) {
  const slashCommands = [...client.slashCommands.values()].map(cmd => cmd.data.toJSON());
  const { REST } = await import('@discordjs/rest');
  const { Routes } = await import('discord-api-types/v10');

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log(chalk.blue('[INFO] Deploying slash commands...'));
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: slashCommands }
    );
    console.log(chalk.green('[INFO] Slash commands deployed successfully!'));
  } catch (error) {
    console.error(chalk.red('[ERROR] Slash command deployment failed:'), error);
  }
}

export async function handleInteraction(interaction, client) {
  if (!interaction.isCommand()) return;

  const cmd = client.slashCommands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (error) {
    console.error(chalk.red(`[ERROR] Slash command failed: ${interaction.commandName}`), error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Terjadi error saat mengeksekusi command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Terjadi error saat mengeksekusi command.', ephemeral: true });
    }
  }
}

export async function handleMessage(message, client) {
  const prefix = config.prefix || '!';
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const cmdName = client.commands.has(commandName)
    ? commandName
    : client.aliases.get(commandName);

  if (!cmdName) return;

  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(chalk.red(`[ERROR] Prefix command failed: ${cmdName}`), error);
    message.reply('Terjadi error saat mengeksekusi command.');
  }
      } 
