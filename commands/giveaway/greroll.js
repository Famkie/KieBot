const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('greroll')
    .setDescription('Ambil ulang pemenang dari giveaway')
    .addStringOption(opt =>
      opt.setName('message_id')
        .setDescription('ID pesan giveaway')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const msgId = interaction.options.getString('message_id');
    try {
      const msg = await interaction.channel.messages.fetch(msgId);
      const reactions = msg.reactions.cache.get('🎉');
      const users = await reactions.users.fetch();
      const entries = users.filter(u => !u.bot).map(u => u);

      if (!entries.length) {
        return interaction.reply({ content: 'Tidak ada peserta.', ephemeral: true });
      }

      const winner = entries[Math.floor(Math.random() * entries.length)];
      interaction.reply(`Pemenang baru: <@${winner.id}>!`);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Gagal reroll giveaway.', ephemeral: true });
    }
  }
};