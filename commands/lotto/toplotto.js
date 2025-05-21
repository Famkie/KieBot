// commands/lotto/toplotto.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toplotto')
    .setDescription('Tampilkan leaderboard lotto berdasarkan jumlah kemenangan'),

  async execute(interaction) {
    const leaderboardPath = path.join(__dirname, '../../data/lottoLeaderboard.json');
    if (!fs.existsSync(leaderboardPath)) {
      return interaction.reply('Belum ada data leaderboard.');
    }

    const raw = fs.readFileSync(leaderboardPath);
    const data = JSON.parse(raw);

    const sorted = Object.entries(data)
      .sort((a, b) => b[1].wins - a[1].wins)
      .slice(0, 10);

    const embed = new EmbedBuilder()
      .setTitle('Lotto Leaderboard')
      .setColor('Gold')
      .setDescription(
        sorted.map(([id, user], i) => `**${i + 1}.** ${user.username} - ${user.wins} kemenangan`).join('\n') || 'Kosong'
      );

    interaction.reply({ embeds: [embed] });
  }
};