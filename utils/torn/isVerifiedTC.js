// utils/torn/isVerifiedTC.js

/**
 * Mengecek apakah user Discord memiliki peran VERIFIED_ROLE_ID di guild TORN_GUILD_ID.
 * 
 * @param {import('discord.js').Client} client - Instance Discord client
 * @param {string} userId - ID user yang ingin diverifikasi
 * @returns {Promise<boolean>} - Apakah user terverifikasi atau tidak
 */
export async function isVerifiedTC(client, userId) {
  try {
    const guild = await client.guilds.fetch(process.env.TORN_GUILD_ID);
    if (!guild) {
      console.warn("Guild tidak ditemukan.");
      return false;
    }

    const member = await guild.members.fetch(userId);
    return member.roles.cache.has(process.env.VERIFIED_ROLE_ID);
  } catch (err) {
    console.error(`Gagal mengecek verifikasi user ${userId}:`, err);
    return false;
  }
}
