import { PermissionsBitField } from 'discord.js';

export default {
  name: 'ban',
  description: 'Ban seorang member dari server.',
  usage: '!ban @user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Kamu tidak punya izin untuk ban.');
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply('Mention user yang ingin kamu ban.');

    if (!member.bannable) return message.reply('Aku tidak bisa ban user itu!');

    try {
      await member.ban();
      message.channel.send(`${member.user.tag} telah di-ban.`);
    } catch (err) {
      message.channel.send('Gagal ban user.');
      console.error(err);
    }
  }
}; 
