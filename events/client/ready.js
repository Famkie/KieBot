module.exports = {
  name: 'ready',
  once: true, // dijalankan sekali saja saat bot nyala
  execute(client) {
    console.log(`✅ Bot ${client.user.tag} sudah online!`);
    client.user.setActivity('/help | KieBot', { type: 'PLAYING' }); // Status bot
  },
};