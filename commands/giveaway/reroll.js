
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rerollgiveaway')
    .setDescription('Pilih ulang pemenang dari giveaway')
    .addStringOption(opt =>
      opt.setName('message_id')
        .setDescription('ID pesan giveaway')
        .setRequired(true)
    ),
  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const giveaway = interaction.client.giveaways.get(messageId);

    if (!giveaway) {
      return interaction.reply({ content: 'Giveaway tidak ditemukan.', ephemeral: true });
    }

    const participants = [...giveaway.participants];
    if (participants.length === 0) {
      return interaction.reply({ content: 'Tidak ada peserta.', ephemeral: true });
    }

    const winner = participants[Math.floor(Math.random() * participants.length)];
    const embed = new EmbedBuilder()
      .setTitle('🔁 Giveaway Reroll')
      .setDescription(`Pemenang baru: <@${winner}>`)
      .setColor(0x1abc9c);

    interaction.reply({ embeds: [embed] });
  }
};
