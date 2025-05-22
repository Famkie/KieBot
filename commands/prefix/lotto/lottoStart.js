// commands/prefix/lotto/lottoStart.js
import { setCurrentLotto, getCurrentLotto } from '../../../utils/torn/lottoStore.js';
import isVerifiedTC from '../../../utils/torn/isVerifiedTC.js';

export default {
  name: 'sl',
  description: 'Memulai undian baru',
  usage: '!sl <prize>',
  async execute(message, args) {
    const userId = message.author.id;

    // Cek verifikasi Torn
    const verified = await isVerifiedTC(message.client, userId);
    if (!verified) {
      return message.reply('Kamu belum terverifikasi di Torn Guild.');
    }

    const prize = args.join(' ');
    if (!prize) {
      return message.reply('Kamu harus menyebutkan hadiah undian. Contoh: `!sl 1b cash`');
    }

    const existingLotto = getCurrentLotto();
    if (existingLotto) {
      return message.reply('Masih ada undian yang sedang berjalan.');
    }

    const newLotto = {
      host: userId,
      prize
    };

    setCurrentLotto(newLotto);
    return message.channel.send(`Undian baru dimulai oleh <@${userId}> untuk **${prize}**! Gunakan \`!j\` untuk bergabung.`);
  }
};
