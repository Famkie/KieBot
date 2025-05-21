module.exports = {
  name: 'clear',
  description: 'Hapus sejumlah pesan dari channel.',
  execute(message, args) {
    if (!message.member.permissions.has('ManageMessages'))
      return message.reply("Kamu tidak punya izin untuk menghapus pesan.");

    const jumlah = parseInt(args[0]);
    if (isNaN(jumlah) || jumlah < 1 || jumlah > 100)
      return message.reply("Masukkan angka antara 1 sampai 100.");

    message.channel.bulkDelete(jumlah, true)
      .then(messages => {
        message.channel.send(`Berhasil hapus ${messages.size} pesan.`)
          .then(msg => setTimeout(() => msg.delete(), 3000));
      })
      .catch(err => {
        message.channel.send("Gagal hapus pesan.");
        console.error(err);
      });
  }
};