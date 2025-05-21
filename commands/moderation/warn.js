module.exports = {
  name: 'warn',
  description: 'Berikan peringatan ke member.',
  async execute(message, args) {
    if (!message.member.permissions.has('ManageMessages'))
      return message.reply("Kamu tidak punya izin untuk memberi peringatan.");

    const member = message.mentions.members.first();
    const alasan = args.slice(1).join(" ") || "Tidak disebutkan";

    if (!member) return message.reply("Mention member yang ingin diberi peringatan.");

    try {
      await member.send(`Kamu mendapat peringatan dari ${message.guild.name}: ${alasan}`);
      message.channel.send(`Peringatan telah dikirim ke ${member.user.tag}.`);
    } catch (err) {
      console.error(err);
      message.channel.send("Gagal kirim DM ke user.");
    }
  }
};