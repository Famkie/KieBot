import { SlashCommandBuilder } from 'discord.js';
import isVerifiedTC from '../../utils/torn/isVerifiedTC.js';
import fetchTornData from '../../utils/torn/fetchTorn.js';
import { getTornUser } from '../../utils/torn/tornUsers.js';

export const data = new SlashCommandBuilder()
  .setName('tcprofile')
  .setDescription('Tampilkan profil Torn City kamu');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const verified = await isVerifiedTC(interaction.client, interaction.user.id);
  if (!verified) {
    return interaction.editReply({
      content: 'Kamu belum terverifikasi di server resmi Torn City.',
    });
  }

  const user = getTornUser(interaction.user.id);
  if (!user) {
    return interaction.editReply('Tidak ditemukan API key untuk akun ini.');
  }

  const data = await fetchTornData('user', 'basic,profile', user.apiKey || user.key);
  if (data.error) {
    return interaction.editReply(`Gagal mengambil data: ${data.error}`);
  }

  return interaction.editReply(
    `**${data.name}** [${data.player_id}]\n` +
    `Level: ${data.level}\n` +
    `Money: $${data.money.toLocaleString()}`
  );
}
