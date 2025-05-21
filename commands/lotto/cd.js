// commands/slash/lotto/countdownDraw.js
import { SlashCommandBuilder } from 'discord.js';
import { getCurrentLotto } from '../../utils/torn/lottoStore.js';
import { drawWinners } from '../../utils/torn/lottoDraw.js';

export const data = new SlashCommandBuilder()
  .setName('cd')
  .setDescription('Mulai countdown dan draw otomatis setelah waktu tertentu')
  .addIntegerOption(option =>
    option.setName('detik')
      .setDescription('Waktu dalam detik sebelum draw dilakukan')
      .setRequired(true)
  );

export async function execute(interaction) {
  const detik = interaction.options.getInteger('detik');
  const lotto = getCurrentLotto();

  if (!lotto) {
    return interaction.reply({ content: 'Tidak ada undian yang sedang berjalan.', ephemeral: true });
  }

  await interaction.reply(`Countdown dimulai. Draw akan dilakukan dalam ${detik} detik.`);

  setTimeout(() => {
    drawWinners(interaction.client, interaction.channel);
  }, detik * 1000);
}
