// commands/prefix/lotto/lottoDraw.js
import { EmbedBuilder } from 'discord.js';
import {
  getCurrentLotto,
  getEntries,
  clearCurrentLotto
} from '../../../utils/torn/lottoStore.js';

export default {
  name: 'draw',
  description: 'Draw the winner(s) of the current lotto',
  async execute(message, args) {
    const lotto = getCurrentLotto();
    if (!lotto) return message.reply('Tidak ada undian aktif.');

    const entries = getEntries();
    if (entries.length < 1) return message.reply('Belum ada peserta yang ikut.');

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

    await message.channel.send({ embeds: [embed] });

    // Reset store
    clearCurrentLotto();
  }
}; 
