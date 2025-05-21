// commands/lotto/linfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lottoStore = require('../../utils/lottoStore');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('linfo')
    .setDescription('Tampilkan informasi lotto yang sedang berjalan'),

  async execute(interaction) {
    const lotto = lottoStore.activeLotto;
    if (!lotto) return interaction.reply('Tidak ada undian yang sedang berjalan.');

    const embed = new EmbedBuilder()
      .setTitle(`Lotto Berjalan - ${lotto.prize}`)
      .addFields(
        { name: 'Durasi', value: `${lotto.duration / 1000}s`, inline: true },
        { name: 'Jumlah Pemenang', value: `${lotto.winners}`, inline: true },
        { name: 'Jumlah Peserta', value: `${lotto.entries.length}`, inline: true },
      )
      .setDescription(
        lotto.entries.map((e, i) => `**${i + 1}.** ${e.username} [${e.tornId}]`).join('\n') || 'Belum ada peserta'
      )
      .setColor('Blue');

    interaction.reply({ embeds: [embed] });
  }
};