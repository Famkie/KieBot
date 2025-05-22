// commands/prefix/lotto/info.js
import { EmbedBuilder } from 'discord.js';
import { getCurrentLotto, getEntries } from '../../../utils/torn/lottoStore.js';

export default {
  name: 'linfo',
  description: 'Tampilkan informasi lotto yang sedang berjalan',
  usage: '!linfo',
  async execute(message) {
    const lotto = getCurrentLotto();
    if (!lotto) return message.reply('Tidak ada undian yang sedang berjalan.');

    const entries = getEntries();

    const embed = new EmbedBuilder()
      .setTitle(`Lotto Berjalan - ${lotto.prize}`)
      .addFields(
        { name: 'Durasi', value: lotto.duration ? `${lotto.duration / 1000}s` : 'N/A', inline: true },
        { name: 'Jumlah Pemenang', value: `${lotto.winners ?? '1'}`, inline: true },
        { name: 'Jumlah Peserta', value: `${entries.length}`, inline: true },
      )
      .setDescription(
        entries.length > 0
          ? entries.map((e, i) => `**${i + 1}.** ${e.username} [${e.tornId}]`).join('\n')
          : 'Belum ada peserta'
      )
      .setColor('Blue');

    await message.channel.send({ embeds: [embed] });
  }
};
