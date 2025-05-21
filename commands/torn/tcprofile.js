const { SlashCommandBuilder } = require('discord.js');
const isVerifiedTC = require('../../utils/isVerifiedTC');
const fetchTornData = require('../../utils/fetchTorn');
const { getTornUser, setTornUser} = require('../../utils/tornUsers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tcprofile')
    .setDescription('Tampilkan profil Torn City kamu'),

  async execute(interaction) {
    await interaction.deferReply();

    // Cek apakah user verified di server resmi Torn City
    const verified = await isVerifiedTC(interaction.client, interaction.user.id);

    if (!verified) {
      return interaction.editReply({
        content: 'Kamu belum terverifikasi di server resmi Torn City.',
        ephemeral: true
      });
    }

    // Ambil data API key dari penyimpanan lokal (opsional jika kamu tetap pakai key)
    const user = getTornUser(interaction.user.id);
    if (!user) {
      return interaction.editReply('Tidak ditemukan API key untuk akun ini.');
    }

    const data = await fetchTornData('user', 'basic,profile', user.key);

    if (data.error) {
      return interaction.editReply(`Gagal mengambil data: ${data.error}`);
    }

    return interaction.editReply(`**${data.name}** [${data.player_id}]\nLevel: ${data.level}\nMoney: $${data.money}`);
  }
};