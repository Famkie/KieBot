// commands/prefix/lotto/toplotto.js
import { EmbedBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';

export default {
  name: 'toplotto',
  description: 'Tampilkan leaderboard lotto berdasarkan jumlah kemenangan',
  usage: '!toplotto',
  async execute(message) {
    const leaderboardPath = path.resolve('./data/lottoLeaderboard.json');
    if (!fs.existsSync(leaderboardPath)) {
      return message.reply('Belum ada data leaderboard.');
    }

    const raw = fs.readFileSync(leaderboardPath, 'utf-8');
    const data = JSON.parse(raw);

    const sorted = Object.entries(data)
      .sort((a, b) => b[1].wins - a[1].wins)
      .slice(0, 10);

    const description = sorted.length
      ? sorted.map(([id, user], i) => `**${i + 1}.** ${user.username} - ${user.wins} kemenangan`).join('\n')
      : 'Kosong';

    const embed = new EmbedBuilder()
      .setTitle('Lotto Leaderboard')
      .setColor('Gold')
      .setDescription(description);

    await message.channel.send({ embeds: [embed] });
  }
};
