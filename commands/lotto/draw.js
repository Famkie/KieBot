// commands/slash/lotto/drawLotto.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import {
  getCurrentLotto,
  getEntries,
  clearCurrentLotto
} from '../../utils/torn/lottoStore.js';

export const data = new SlashCommandBuilder()
  .setName('draw')
  .setDescription('Draw the winner(s) of the current lotto');

export async function execute(interaction) {
  const lotto = getCurrentLotto();
  if (!lotto) return interaction.reply({ content: 'Tidak ada undian aktif.', ephemeral: true });

  const entries = getEntries();
  if (entries.length < 1) return interaction.reply({ content: 'Belum ada peserta yang ikut.', ephemeral: true });

  // Shuffle peserta
  const shuffled = [...entries].sort(() => 0.5 - Math.random());
  const winners = shuffled.slice(0, lotto.winners);

  const winnerText = winners
    .map((w, i) => `**${i + 1}.** ${w.username} [${w.tornId}]`)
    .join('\n');

  const embed = new EmbedBuilder()
    .setTitle(`Lotto Draw - ${lotto.prize}`)
    .setDescription(`Pemenang (${lotto.winners}):\n${winnerText}`)
    .setColor('Gold')
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });

  // Reset store
  clearCurrentLotto();
}
