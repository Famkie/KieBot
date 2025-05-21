const isVerifiedTC = require('../../utils/isVerifiedTC');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {
    // Cek apakah user terverifikasi di server Torn City resmi
    const verified = await isVerifiedTC(member.client, member.id);
    
    if (verified) {
      // Cari role yang akan diberikan di server milikmu
      const role = member.guild.roles.cache.find(r => r.name === 'Verified TC');

      if (role) {
        await member.roles.add(role);
        console.log(`[AUTO VERIFY] ${member.user.tag} diberi role Verified TC`);
      }
    }
  },
};