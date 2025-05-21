module.exports = async function isVerifiedTC(client, userId) {
  const guild = await client.guilds.fetch(process.env.TORN_GUILD_ID);
  if (!guild) return false;

  try {
    const member = await guild.members.fetch(userId);
    return member.roles.cache.has(process.env.VERIFIED_ROLE_ID);
  } catch (err) {
    return false;
  }
};