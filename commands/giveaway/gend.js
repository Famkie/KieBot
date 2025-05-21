const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('Akhiri giveaway dan pilih pemenang')
    .addStringOption(opt =>
      opt.setName('message_id')
         .setDescription('ID pesan giveaway')
         .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('winners')
         .setDescription('Jumlah pemenang')
         .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const winnersAmount = interaction.options.getInteger('winners');

    try {
      const giveawayMsg = await interaction.channel.messages.fetch(messageId);
      const reaction = giveawayMsg.reactions.cache.get('🎉');

      if (!reaction) return interaction.reply({ content: 'Tidak ada reaksi 🎉 pada pesan tersebut.', ephemeral: true });

      const users = await reaction.users.fetch();
      const entries = users.filter(user => !user.bot).map(user => user);

      if (entries.length === 0) {
        return interaction.reply({ content: 'Tidak ada peserta pada giveaway tersebut.', ephemeral: true });
      }

      const winners = [];
      for (let i = 0; i < Math.min(winnersAmount, entries.length); i++) {
        const randomIndex = Math.floor(Math.random() * entries.length);
        const selected = entries.splice(randomIndex, 1)[0];
        winners.push(selected);
      }

      interaction.reply({
        content: `🎉 Giveaway Selesai! Pemenang:\n${winners.map(w => `<@${w.id}>`).join('\n')}`,
        allowedMentions: { users: winners.map(w => w.id) },
      });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Terjadi kesalahan saat mengambil data giveaway.', ephemeral: true });
    }
  },
};