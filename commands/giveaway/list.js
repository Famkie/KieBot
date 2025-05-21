
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listgiveaway')
    .setDescription('Lihat semua giveaway yang sedang aktif'),
  async execute(interaction) {
    const giveaways = [...interaction.client.giveaways.entries()];
    if (giveaways.length === 0)
      return interaction.reply({ content: 'Tidak ada giveaway aktif.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('📋 Daftar Giveaway Aktif')
      .setColor(0x7289da);

    for (const [id, data] of giveaways) {
      embed.addFields({
        name: `Hadiah: ${data.prize}`,
        value: `Pesan ID: \`${id}\`\nBerakhir: <t:${Math.floor(data.endsAt / 1000)}:R>`,
      });
    }

    interaction.reply({ embeds: [embed] });
  }
};
