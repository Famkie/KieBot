
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('myentries')
    .setDescription('Cek apakah kamu sudah ikut dalam giveaway')
    .addStringOption(opt =>
      opt.setName('message_id').setDescription('ID pesan giveaway').setRequired(true)
    ),
  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const giveaway = interaction.client.giveaways.get(messageId);

    if (!giveaway) return interaction.reply({ content: 'Giveaway tidak ditemukan.', ephemeral: true });

    const isParticipant = giveaway.participants.has(interaction.user.id);
    interaction.reply({
      content: isParticipant
        ? 'Kamu sudah ikut giveaway ini!'
        : 'Kamu belum ikut giveaway ini.',
      ephemeral: true
    });
  }
};
