import { PermissionsBitField } from 'discord.js';

export default {
  name: 'kick',
  description: 'Kick seorang member dari server.',
  usage: '!kick @user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('Kamu tidak punya izin untuk kick.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Mention user yang ingin kamu kick.');
    }

    if (!member.kickable) {
      return message.reply('Aku tidak bisa kick user itu!');
    }

    try {
      await member.kick();
      message.channel.send(`${member.user.tag} telah di-kick.`);
    } catch (err) {
      console.error(err);
      message.channel.send('Gagal kick user.');
    }
  }
};
