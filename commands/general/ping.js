import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Cek latency bot.');

export const name = 'ping';

export async function execute(context) {
  // Hybrid detection
  if (context.isCommand?.()) {
    // Slash Command
    const sent = await context.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - context.createdTimestamp;
    await context.editReply(`Pong! Latency: ${latency}ms`);
  } else if (context.content) {
    // Prefix Command
    const sent = await context.reply('Pinging...');
    const latency = sent.createdTimestamp - context.createdTimestamp;
    await sent.edit(`Pong! Latency: ${latency}ms`);
  }
}
