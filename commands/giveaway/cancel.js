import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('cancelgiveaway')
    .setDescription('Batalkan giveaway aktif')
    .addStringOption(opt =>
      opt.setName('message_id')
        .setDescription('ID pesan giveaway')
        .setRequired(true)
    ),

  async slashExecute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const giveaway = interaction.client.giveaways.get(messageId);

    if (!giveaway) {
      return interaction.reply({ content: 'Giveaway tidak ditemukan.', ephemeral: true });
    }

    interaction.client.giveaways.delete(messageId);
    interaction.reply({ content: 'Giveaway berhasil dibatalkan.' });
  }
};
