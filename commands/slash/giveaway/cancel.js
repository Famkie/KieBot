import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('giveaway-cancel')
  .setDescription('Batalkan giveaway aktif tanpa pemenang (admin only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({ content: 'Kamu tidak punya izin untuk membatalkan giveaway.', ephemeral: true });
  }

  const giveaway = giveaways.get(interaction.channel.id);

  if (!giveaway) {
    return interaction.reply({ content: 'Tidak ada giveaway aktif di channel ini.', ephemeral: true });
  }

  clearTimeout(giveaway.timeout);

  giveaways.delete(interaction.channel.id);

  await interaction.reply({ content: 'Giveaway telah dibatalkan tanpa pemenang.', ephemeral: true });
} 
