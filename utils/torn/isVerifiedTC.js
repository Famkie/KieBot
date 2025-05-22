// utils/torn/isVerifiedTC.js
const verifiedRoleId = 'ROLE_ID_VERIFIED_TORN'; // Ganti sesuai role verified kamu
const guildId = '1353368445395275776'; // CLIENT_GUILD kamu

// Cache untuk menyimpan hasil cek per user selama 5 menit (300000 ms)
const cache = new Map();

export default async function isVerifiedTC(client, userId) {
  // Cek cache dulu
  const cached = cache.get(userId);
  const now = Date.now();
  if (cached && now - cached.timestamp < 300000) {
    return cached.verified;
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) throw new Error('Guild not found');

    const member = await guild.members.fetch(userId);
    if (!member) throw new Error('Member not found');

    const verified = member.roles.cache.has(verifiedRoleId);

    // Update cache
    cache.set(userId, { verified, timestamp: now });

    return verified;
  } catch (error) {
    console.error(`isVerifiedTC error for user ${userId}:`, error.message);
    // Kalau error, anggap user belum verified
    return false;
  }
}
