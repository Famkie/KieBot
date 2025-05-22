// commands/lotto/j.js

import { SlashCommandBuilder } from 'discord.js';
import { addEntry, getCurrentLotto, getEntryById } from '../../utils/torn/lottoStore.js';
import { isVerifiedTC } from '../../utils/torn/isVerifiedTC.js';

export const data = new SlashCommandBuilder()
  .setName('j')
  .setDescription('Join undian aktif');

export async function execute(interaction) {
  const lotto = getCurrentLotto();
  if (!lotto) {
    return interaction.reply({ content: 'Tidak ada undian aktif saat ini.', ephemeral: true });
  }

  const userId = interaction.user.id;

  // Cek apakah user sudah join
  if (getEntryById(userId)) {
    return interaction.reply({ content: 'Kamu sudah join undian ini.', ephemeral: true });
  }

  // Cek apakah user terverifikasi (opsional)
  const verified = await isVerifiedTC(interaction.client, userId);
  if (!verified) {
    return interaction.reply({ content: 'Kamu belum terverifikasi di Torn Guild.', ephemeral: true });
  }

  const entry = {
    id: userId,
    name: interaction.user.username,
    joinedAt: Date.now()
  };

  addEntry(entry);
  return interaction.reply({ content: `Berhasil join undian untuk ${lotto.prize}!`, ephemeral: false });
}
