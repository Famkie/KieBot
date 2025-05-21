import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('listgiveaway')
    .setDescription('Lihat semua giveaway yang sedang aktif'),

  async slashExecute(interaction) {
    const giveaways = [...interaction.client.giveaways.entries()];
    if (giveaways.length === 0)
      return interaction.reply({
        content: 'Tidak ada giveaway aktif.',
        ephemeral: true
      });

    const embed = new EmbedBuilder()
      .setTitle('📋 Daftar Giveaway Aktif')
      .setColor(0x7289da);

    for (const [id, data] of giveaways) {
      embed.addFields({
        name: `🎁 ${data.prize}`,
        value: `Pesan ID: \`${id}\`\nPeserta: **${data.participants?.size ?? 0}**\nBerakhir: <t:${Math.floor(data.endsAt / 1000)}:R>`,
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
