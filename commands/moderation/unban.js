// commands/prefix/moderation/unban.js
import { PermissionsBitField } from 'discord.js';

export const name = 'unban';
export const description = 'Unban user dengan ID (prefix only).';

export async function execute(message, args) {
  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.reply('Kamu tidak punya izin untuk unban.');
  }

  const userId = args[0];
  if (!userId) {
    return message.reply('Masukkan ID user yang ingin di-unban. Contoh: `!unban 1234567890`');
  }

  try {
    const banInfo = await message.guild.bans.fetch(userId).catch(() => null);

    if (!banInfo) {
      return message.reply('User tidak ditemukan dalam daftar ban.');
    }

    await message.guild.members.unban(userId);
    message.channel.send(`✅ ${banInfo.user.tag} berhasil di-unban.`);
  } catch (err) {
    console.error(err);
    message.channel.send('Terjadi error saat mencoba unban user.');
  }
}
