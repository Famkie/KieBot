import { PermissionsBitField } from 'discord.js';

export const name = 'warn';
export const description = 'Berikan peringatan ke member. Penggunaan: !warn @user [alasan]';

export async function execute(message, args) {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return message.reply("Kamu tidak punya izin untuk memberi peringatan.");
  }

  const member = message.mentions.members.first();
  if (!member) {
    return message.reply("Mention member yang ingin diberi peringatan.");
  }

  const alasan = args.slice(1).join(" ") || "Tidak disebutkan";

  try {
    await member.send(`**Peringatan dari ${message.guild.name}**\nAlasan: ${alasan}`);
    message.channel.send(`Peringatan telah dikirim ke **${member.user.tag}**.`);
  } catch (err) {
    console.error(err);
    message.channel.send("Gagal kirim DM ke user. Kemungkinan DM-nya ditutup.");
  }
} 
