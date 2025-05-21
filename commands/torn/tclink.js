const { SlashCommandBuilder } = require('discord.js');
const fetchTornData = require('../../utils/fetchTorn');
const { setTornUser } = require('../../utils/tornUsers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tclink')
    .setDescription('Verifikasi akun Torn City kamu')
    .addStringOption(option =>
      option.setName('apikey')
        .setDescription('API key Torn City kamu')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const apiKey = interaction.options.getString('apikey');

    const data = await fetchTornData('user', 'basic,profile', apiKey);

    if (data.error) {
      return interaction.editReply(`Gagal verifikasi: ${data.error}`);
    }

    await setTornUser(interaction.user.id, apiKey);

    return interaction.editReply(
      `Berhasil terverifikasi sebagai **${data.name}** [${data.player_id}]`
    );
  }
};