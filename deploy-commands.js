const GUILD_ID = process.env.GUILD_ID; // Optional, untuk dev testing

(async () => {
  try {
    console.log('⏳ Mengupdate slash command...');

    if (GUILD_ID) {
      // Deploy ke server tertentu (lebih cepat untuk testing)
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Slash command diupdate untuk Guild ID: ${GUILD_ID}`);
    } else {
      // Deploy global (butuh waktu hingga 1 jam untuk sync)
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Slash command global berhasil diupdate.');
    }

  } catch (err) {
    console.error('❌ Gagal update slash command:', err);
  }
})();
