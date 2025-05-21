import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import lottoStore from '../../utils/torn/lottoStore.js';
import { getTornUser } from '../../utils/torn/tornUsers.js';
import fetchTornData from '../../utils/torn/fetchTorn.js';

export const data = new SlashCommandBuilder()
  .setName('j')
  .setDescription('Join the current lotto');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const tornUser = getTornUser(interaction.user.id);
  if (!tornUser) return interaction.editReply('Akun kamu belum terhubung dengan Torn City. Gunakan `/tcverify`.');

  const profile = await fetchTornData('user', 'basic', tornUser.key);
  if (profile.error) return interaction.editReply(`Gagal ambil data Torn: ${profile.error}`);

  const lotto = lottoStore.activeLotto;
  if (!lotto) return interaction.editReply('Tidak ada undian aktif saat ini.');

  const alreadyJoined = lotto.entries.find(e => e.id === interaction.user.id);
  if (alreadyJoined) return interaction.editReply('Kamu sudah ikut undian ini.');

  const entryNumber = lotto.entries.length + 1;
  lotto.entries.push({ id: interaction.user.id, username: profile.name, tornId: profile.player_id });

  const embed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`✅ ${profile.name} [${profile.player_id}] berhasil masuk undian sebagai nomor ${entryNumber}`);

  await interaction.channel.send({ embeds: [embed] });
  await interaction.editReply('Berhasil masuk ke undian.');
}
