import { PermissionsBitField } from 'discord.js';

export default {
  name: 'clear',
  description: 'Hapus sejumlah pesan dari channel.',
  usage: '!clear <jumlah>',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('Kamu tidak punya izin untuk menghapus pesan.');
    }

    const jumlah = parseInt(args[0]);
    if (isNaN(jumlah) || jumlah < 1 || jumlah > 100) {
      return message.reply('Masukkan angka antara 1 sampai 100.');
    }

    try {
      const deleted = await message.channel.bulkDelete(jumlah, true);

      const notif = await message.channel.send(`Berhasil hapus ${deleted.size} pesan.`);
      setTimeout(() => notif.delete().catch(() => {}), 3000);
    } catch (err) {
      console.error(err);
      message.channel.send('Gagal hapus pesan.');
    }
  }
}; 
