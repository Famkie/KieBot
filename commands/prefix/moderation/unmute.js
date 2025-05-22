import { PermissionsBitField } from 'discord.js';

export default {
  name: 'unmute',
  description: 'Unmute member dengan menghapus role Muted.',
  usage: '!unmute @user',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply('Kamu tidak punya izin untuk unmute.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Mention member yang ingin di-unmute.');
    }

    const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!muteRole) {
      return message.reply('Role Muted tidak ditemukan di server ini.');
    }

    if (!member.roles.cache.has(muteRole.id)) {
      return message.reply('User ini tidak sedang di-mute.');
    }

    try {
      await member.roles.remove(muteRole);
      message.channel.send(`${member.user.tag} telah di-unmute.`);
    } catch (err) {
      console.error(err);
      message.channel.send('Gagal unmute user.');
    }
  }
}; 
