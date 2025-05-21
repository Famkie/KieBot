const fs = require("fs");
const path = require("path");

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    // Handle Button Interactions
    if (interaction.isButton()) {
      if (interaction.customId === "join_lotto") {
        const lottoPath = path.join(__dirname, "../data/lotto.json");
        if (!fs.existsSync(lottoPath)) return;

        const lottoData = JSON.parse(fs.readFileSync(lottoPath));
        if (!lottoData.host || !lottoData.prize) {
          return interaction.reply({ content: "Tidak ada lotto aktif!", ephemeral: true });
        }

        const alreadyJoined = lottoData.entries.find(e => e.user === interaction.user.id);
        if (alreadyJoined) {
          return interaction.reply({ content: "Kamu sudah ikut!", ephemeral: true });
        }

        const entryNumber = lottoData.entries.length + 1;
        lottoData.entries.push({ user: interaction.user.id, entry: entryNumber });

        fs.writeFileSync(lottoPath, JSON.stringify(lottoData, null, 2));

        return interaction.reply({
          content: `✅ ${interaction.user.tag} telah masuk undian sebagai nomor **${entryNumber}**.`,
          ephemeral: false
        });
      }
      return; // Keluar jika bukan tombol yang relevan
    }

    // Handle Slash Command Interactions
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        content: 'Command tidak ditemukan.',
        ephemeral: true
      });
    }

    try {
      await command.slashExecute(interaction, client);
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: 'Terjadi error saat menjalankan slash command.',
        ephemeral: true
      });
    }
  }
};