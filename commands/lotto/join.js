// commands/prefix/lotto/join.js
import { addEntry, getCurrentLotto, getEntryById } from '../../../utils/torn/lottoStore.js';
import isVerifiedTC from '../../../utils/torn/isVerifiedTC.js';

export default {
  name: 'j',
  description: 'Join undian aktif',
  usage: '!j',
  async execute(message) {
    const lotto = getCurrentLotto();
    if (!lotto) {
      return message.reply('Tidak ada undian aktif saat ini.');
    }

    const userId = message.author.id;

    // Cek apakah user sudah join
    if (getEntryById(userId)) {
      return message.reply('Kamu sudah join undian ini.');
    }

    // Cek apakah user terverifikasi (opsional)
    const verified = await isVerifiedTC(message.client, userId);
    if (!verified) {
      return message.reply('Kamu belum terverifikasi di Torn Guild.');
    }

    const entry = {
      id: userId,
      username: message.author.username,
      joinedAt: Date.now()
    };

    addEntry(entry);
    return message.reply(`Berhasil join undian untuk ${lotto.prize}!`);
  }
};
