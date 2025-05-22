// commands/lotto/sl.js

import { SlashCommandBuilder } from 'discord.js';
import { setCurrentLotto, getCurrentLotto } from '../../utils/torn/lottoStore.js';
import isVerifiedTC from '../../utils/torn/isVerifiedTC.js';

export const data = new SlashCommandBuilder()
  .setName('sl')
  .setDescription('Memulai undian baru')
  .addStringOption(option =>
    option.setName('prize')
      .setDescription('Hadiah undian')
      .setRequired(true)
  );

export async function execute(interaction) {
  const userId = interaction.user.id;

  // Cek verifikasi Torn
  const verified = await isVerifiedTC(interaction.client, userId);
  if (!verified) {
    return interaction.reply({ content: 'Kamu belum terverifikasi di Torn Guild.', ephemeral: true });
  }

  const prize = interaction.options.getString('prize');
  const existingLotto = getCurrentLotto();

  if (existingLotto) {
    return interaction.reply({ content: 'Masih ada undian yang sedang berjalan.', ephemeral: true });
  }

  const newLotto = {
    host: userId,
    prize,
    startedAt: Date.now()
  };

  setCurrentLotto(newLotto);
  return interaction.reply(`Undian baru dimulai oleh <@${userId}> untuk **${prize}**! Gunakan \`/j\` untuk bergabung.`);
}
