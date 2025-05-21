import { SlashCommandBuilder } from 'discord.js';
import lottoStore from '../../utils/torn/lottoStore.js';
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
  const lotto = lottoStore.activeLotto;

  if (!lotto) {
    return interaction.reply('Tidak ada undian yang sedang berjalan.');
  }

  await interaction.reply(`Countdown dimulai. Draw akan dilakukan dalam ${detik} detik.`);

  setTimeout(() => {
    drawWinners(interaction.client, interaction.channel);
  }, detik * 1000);
}
