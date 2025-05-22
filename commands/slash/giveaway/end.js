import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

// PASTIKAN variabel giveaways dan fungsi endGiveaway sudah ada di scope (impor atau dari global)

export const data = new SlashCommandBuilder()
  .setName('giveaway-end')
  .setDescription('Akhiri giveaway aktif di channel ini (hanya admin)')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  // Cek user punya permission ManageMessages atau Admin
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({ content: 'Kamu tidak punya izin untuk mengakhiri giveaway ini.', ephemeral: true });
  }

  const channelId = interaction.channel.id;
  const giveaway = giveaways.get(channelId);

  if (!giveaway) {
    return interaction.reply({ content: 'Tidak ada giveaway aktif di channel ini.', ephemeral: true });
  }

  clearTimeout(giveaway.timeout);
  await endGiveaway(channelId);

  await interaction.reply({ content: 'Giveaway berhasil diakhiri oleh admin.', ephemeral: true });
} 
