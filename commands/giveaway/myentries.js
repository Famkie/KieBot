import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('myentries')
    .setDescription('Cek apakah kamu sudah ikut dalam giveaway tertentu')
    .addStringOption(opt =>
      opt.setName('message_id')
        .setDescription('ID pesan giveaway')
        .setRequired(true)
    ),

  async slashExecute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const giveaway = interaction.client.giveaways.get(messageId);

    if (!giveaway) {
      return interaction.reply({
        content: 'Giveaway tidak ditemukan atau sudah berakhir.',
        ephemeral: true
      });
    }

    const hasJoined = giveaway.participants?.has?.(interaction.user.id);
    return interaction.reply({
      content: hasJoined
        ? '✅ Kamu sudah ikut giveaway ini!'
        : '❌ Kamu belum ikut giveaway ini.',
      ephemeral: true
    });
  }
};
