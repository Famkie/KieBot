const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'gstart',
  aliases: ['giveaway', 'gw'],
  data: new SlashCommandBuilder()
    .setName('gstart')
    .setDescription('Mulai giveaway')
    .addStringOption(option =>
      option.setName('durasi')
        .setDescription('Contoh: 30s, 1m, 2h, 1d')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('pemenang')
        .setDescription('Jumlah pemenang')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('hadiah')
        .setDescription('Hadiah giveaway')
        .setRequired(true)),

  async execute(message, args) {
    if (args.length < 3) {
      return message.reply('Format: `!gstart <durasi> <jumlah_pemenang> <hadiah>`');
    }

    const rawDuration = args[0];
    const winnerCount = parseInt(args[1]);
    const prize = args.slice(2).join(' ');
    const duration = ms(rawDuration);

    if (!duration || isNaN(winnerCount) || winnerCount < 1) {
      return message.reply('Durasi tidak valid atau jumlah pemenang minimal 1.');
    }

    const giveawayMsg = await message.channel.send(
      `🎉 **GIVEAWAY DIMULAI!** 🎉\n` +
      `Hadiah: **${prize}**\n` +
      `Durasi: **${rawDuration}**\n` +
      `Jumlah pemenang: **${winnerCount}**\n\n` +
      `Klik 🎉 untuk ikut!`
    );

    await giveawayMsg.react('🎉');

    setTimeout(async () => {
      const fetched = await message.channel.messages.fetch(giveawayMsg.id);
      const reaction = fetched.reactions.cache.get('🎉');
      const users = await reaction.users.fetch();
      const participants = users.filter(u => !u.bot).map(u => u.id);

      if (participants.length < winnerCount) {
        return message.channel.send('Peserta kurang dari jumlah pemenang. Giveaway dibatalkan.');
      }

      const shuffled = participants.sort(() => 0.5 - Math.random());
      const winners = shuffled.slice(0, winnerCount).map(id => `<@${id}>`).join(', ');

      message.channel.send(
        `🎉 **GIVEAWAY SELESAI!** 🎉\n` +
        `Hadiah: **${prize}**\n` +
        `Pemenang: ${winners}`
      );
    }, duration);
  },

  async slashExecute(interaction) {
    const rawDuration = interaction.options.getString('durasi');
    const winnerCount = interaction.options.getInteger('pemenang');
    const prize = interaction.options.getString('hadiah');
    const duration = ms(rawDuration);

    if (!duration || winnerCount < 1) {
      return interaction.reply({ content: 'Durasi tidak valid atau jumlah pemenang minimal 1.', ephemeral: true });
    }

    const giveawayMsg = await interaction.channel.send(
      `🎉 **GIVEAWAY DIMULAI!** 🎉\n` +
      `Hadiah: **${prize}**\n` +
      `Durasi: **${rawDuration}**\n` +
      `Jumlah pemenang: **${winnerCount}**\n\n` +
      `Klik 🎉 untuk ikut!`
    );

    await giveawayMsg.react('🎉');
    await interaction.reply({ content: 'Giveaway dimulai!', ephemeral: true });

    setTimeout(async () => {
      const fetched = await interaction.channel.messages.fetch(giveawayMsg.id);
      const reaction = fetched.reactions.cache.get('🎉');
      const users = await reaction.users.fetch();
      const participants = users.filter(u => !u.bot).map(u => u.id);

      if (participants.length < winnerCount) {
        return interaction.channel.send('Peserta kurang dari jumlah pemenang. Giveaway dibatalkan.');
      }

      const shuffled = participants.sort(() => 0.5 - Math.random());
      const winners = shuffled.slice(0, winnerCount).map(id => `<@${id}>`).join(', ');

      interaction.channel.send(
        `🎉 **GIVEAWAY SELESAI!** 🎉\n` +
        `Hadiah: **${prize}**\n` +
        `Pemenang: ${winners}`
      );
    }, duration);
  }
};