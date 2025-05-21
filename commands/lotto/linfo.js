// commands/slash/lotto/infoLotto.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getCurrentLotto, getEntries } from '../../utils/torn/lottoStore.js';

export const data = new SlashCommandBuilder()
  .setName('linfo')
  .setDescription('Tampilkan informasi lotto yang sedang berjalan');

export async function execute(interaction) {
  const lotto = getCurrentLotto();
  if (!lotto) return interaction.reply({ content: 'Tidak ada undian yang sedang berjalan.', ephemeral: true });

  const entries = getEntries();

  const embed = new EmbedBuilder()
    .setTitle(`Lotto Berjalan - ${lotto.prize}`)
    .addFields(
      { name: 'Durasi', value: `${lotto.duration / 1000}s`, inline: true },
      { name: 'Jumlah Pemenang', value: `${lotto.winners}`, inline: true },
      { name: 'Jumlah Peserta', value: `${entries.length}`, inline: true },
    )
    .setDescription(
      entries.length > 0
        ? entries.map((e, i) => `**${i + 1}.** ${e.username} [${e.tornId}]`).join('\n')
        : 'Belum ada peserta'
    )
    .setColor('Blue');

  await interaction.reply({ embeds: [embed] });
}
