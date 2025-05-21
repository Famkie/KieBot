const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('endgiveaway')
    .setDescription('Paksa akhiri giveaway')
    .addStringOption(opt =>
      opt.setName('message_id').setDescription('ID pesan giveaway').setRequired(true)
    ),
  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const giveaway = interaction.client.giveaways.get(messageId);
    if (!giveaway) return interaction.reply({ content: 'Giveaway tidak ditemukan.', ephemeral: true });

    const participants = [...giveaway.participants];
    const winner = participants.length > 0
      ? `<@${participants[Math.floor(Math.random() * participants.length)]}>`
      : 'Tidak ada peserta';

    interaction.client.giveaways.delete(messageId);

    const embed = new EmbedBuilder()
      .setTitle('⏹️ Giveaway Diakhiri Manual')
      .setDescription(`Pemenang: ${winner}`)
      .setColor(0xe74c3c);

    interaction.reply({ embeds: [embed] });
  }
};
