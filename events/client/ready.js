export default {
  name: 'ready',
  once: true, // cuma dijalankan sekali saat bot nyala

  execute(client) {
    console.log(`✅ Bot ${client.user.tag} sudah online!`);
    client.user.setActivity('/help | KieBot', { type: 'PLAYING' }); // set status bot
  },
};
