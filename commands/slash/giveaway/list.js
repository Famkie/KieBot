import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('giveaway-list')
  .setDescription('Tampilkan semua giveaway aktif');

export async function execute(interaction) {
  if (giveaways.size === 0) {
    return interaction.reply({ content: 'Tidak ada giveaway aktif.', ephemeral: true });
  }

  let list = '';
  giveaways.forEach((g, channelId) => {
    list += `<#${channelId}> - Hadiah: **${g.hadiah}** - Berakhir: ${new Date(g.endsAt).toLocaleString()}\n`;
  });

  await interaction.reply({ content: `Giveaway aktif:\n${list}`, ephemeral: true });
} 
