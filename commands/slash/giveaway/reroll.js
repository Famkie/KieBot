import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('giveaway-reroll')
  .setDescription('Pilih ulang pemenang giveaway yang sudah selesai (admin only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({ content: 'Kamu tidak punya izin untuk reroll giveaway.', ephemeral: true });
  }

  const giveaway = giveaways.get(interaction.channel.id);

  if (!giveaway) {
    return interaction.reply({ content: 'Tidak ada giveaway aktif di channel ini.', ephemeral: true });
  }

  if (Date.now() < giveaway.endsAt) {
    return interaction.reply({ content: 'Giveaway ini belum selesai, belum bisa reroll.', ephemeral: true });
  }

  const pesertaArr = Array.from(giveaway.participants);
  if (pesertaArr.length === 0) {
    return interaction.reply({ content: 'Tidak ada peserta giveaway untuk dipilih ulang.', ephemeral: true });
  }

  const winnerId = pesertaArr[Math.floor(Math.random() * pesertaArr.length)];
  await interaction.reply({ content: `<@${winnerId}> memenangkan giveaway dengan hadiah **${giveaway.hadiah}**! Selamat!`, ephemeral: false });
} 
