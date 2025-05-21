import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';

export const data = new SlashCommandBuilder()
  .setName('toplotto')
  .setDescription('Tampilkan leaderboard lotto berdasarkan jumlah kemenangan');

export async function execute(interaction) {
  const leaderboardPath = path.resolve('./data/lottoLeaderboard.json');
  if (!fs.existsSync(leaderboardPath)) {
    return interaction.reply({ content: 'Belum ada data leaderboard.', ephemeral: true });
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

  await interaction.reply({ embeds: [embed] });
}
