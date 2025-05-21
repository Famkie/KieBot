module.exports = {
  name: 'unban',
  description: 'Unban user dengan ID.',
  async execute(message, args) {
    if (!message.member.permissions.has('BanMembers'))
      return message.reply("Kamu tidak punya izin untuk unban.");

    const userId = args[0];
    if (!userId) return message.reply("Masukkan ID user yang ingin di-unban.");

    try {
      const bannedUsers = await message.guild.bans.fetch();
      const user = bannedUsers.get(userId);

      if (!user) return message.reply("User tidak ditemukan dalam daftar ban.");

      await message.guild.members.unban(userId);
      message.channel.send(`${user.user.tag} telah di-unban.`);
    } catch (err) {
      console.error(err);
      message.channel.send("Gagal unban user.");
    }
  }
};