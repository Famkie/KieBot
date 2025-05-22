// commands/prefix/lotto/lottoCd.js
import { getCurrentLotto } from '../../../utils/torn/lottoStore.js';
import { drawWinners } from '../../../utils/torn/lottoDraw.js';

export default {
  name: 'cd',
  description: 'Mulai countdown dan draw otomatis setelah waktu tertentu',
  usage: '!cd <detik>',
  async execute(message, args) {
    const detik = parseInt(args[0]);
    if (isNaN(detik) || detik <= 0) {
      return message.reply('Waktu harus berupa angka detik yang valid. Contoh: `!cd 10`');
    }

    const lotto = getCurrentLotto();
    if (!lotto) {
      return message.reply('Tidak ada undian yang sedang berjalan.');
    }

    await message.channel.send(`Countdown dimulai. Draw akan dilakukan dalam ${detik} detik.`);

    setTimeout(() => {
      drawWinners(message.client, message.channel);
    }, detik * 1000);
  }
};
