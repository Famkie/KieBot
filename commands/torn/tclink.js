import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetchTornData from '../../utils/torn/fetchTorn.js';
import { getTornUser, setTornUser } from '../../utils/torn/tornUsers.js';

export const data = new SlashCommandBuilder()
  .setName('tclink')
  .setDescription('Verifikasi akun Torn City kamu')
  .addStringOption(option =>
    option.setName('apikey')
      .setDescription('API key Torn City kamu')
      .setRequired(true)
  );

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const apiKey = interaction.options.getString('apikey');

  // Cek apakah user sudah pernah verifikasi
  const existing = getTornUser(interaction.user.id);
  if (existing) {
    return interaction.editReply(`Kamu sudah terverifikasi sebagai **${existing.username}**.\nGunakan \`/tcunlink\` untuk mengganti akun.`);
  }

  const data = await fetchTornData('user', 'basic,profile', apiKey);

  if (data.error) {
    return interaction.editReply(`Gagal verifikasi: ${data.error}`);
  }

  if (!data.name || !data.player_id) {
    return interaction.editReply('Data dari Torn City tidak lengkap. Silakan coba lagi.');
  }

  await setTornUser(interaction.user.id, apiKey, data.name, data.player_id);

  const embed = new EmbedBuilder()
    .setTitle('Verifikasi Berhasil')
    .setDescription(`Akun kamu telah berhasil dihubungkan ke Torn City.`)
    .addFields(
      { name: 'Username', value: data.name, inline: true },
      { name: 'Torn ID', value: String(data.player_id), inline: true }
    )
    .setColor('Green')
    .setFooter({ text: 'Selamat bermain dan semoga hoki!' });

  return interaction.editReply({ embeds: [embed] });
}
