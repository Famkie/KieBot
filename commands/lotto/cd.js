// commands/lotto/cd.js
const { SlashCommandBuilder } = require('discord.js');
const lottoStore = require('../../utils/lottoStore');
const { drawWinners } = require('../../utils/lottoDraw');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cd')
    .setDescription('Mulai countdown dan draw otomatis setelah waktu tertentu')
    .addIntegerOption(option =>
      option.setName('detik')
        .setDescription('Waktu dalam detik sebelum draw dilakukan')
        .setRequired(true)),

  async execute(interaction) {
    const detik = interaction.options.getInteger('detik');
    const lotto = lottoStore.activeLotto;

    if (!lotto) {
      return interaction.reply('Tidak ada undian yang sedang berjalan.');
    }

    interaction.reply(`Countdown dimulai. Draw akan dilakukan dalam ${detik} detik.`);

    setTimeout(() => {
      drawWinners(interaction.client, interaction.channel);
    }, detik * 1000);
  }
};