module.exports = {
  name: 'mute',
  description: 'Mute member dengan role.',
  async execute(message, args) {
    if (!message.member.permissions.has('ManageRoles'))
      return message.reply("Kamu tidak punya izin untuk mute.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("Mention member yang ingin di-mute.");

    let muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!muteRole) {
      try {
        muteRole = await message.guild.roles.create({
          name: 'Muted',
          permissions: []
        });

        message.guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.create(muteRole, {
            SendMessages: false,
            AddReactions: false
          });
        });
      } catch (err) {
        console.error(err);
        return message.reply("Gagal membuat role Muted.");
      }
    }

    member.roles.add(muteRole).then(() => {
      message.channel.send(`${member.user.tag} telah di-mute.`);
    }).catch(err => {
      console.error(err);
      message.channel.send("Gagal mute user.");
    });
  }
};