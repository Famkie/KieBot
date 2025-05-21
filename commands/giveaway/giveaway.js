const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Mulai giveaway!')
    .addStringOption(opt =>
      opt.setName('hadiah').setDescription('Hadiah giveaway').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('durasi').setDescription('Durasi dalam detik').setRequired(true)
    ),
  async execute(interaction) {
    const hadiah = interaction.options.getString('hadiah');
    const durasi = interaction.options.getInteger('durasi');

    const embed = new EmbedBuilder()
      .setTitle('🎉 GIVEAWAY DIMULAI 🎉')
      .setDescription(`Hadiah: **${hadiah}**\nKlik tombol di bawah buat ikut!`)
      .setColor(0x00AE86)
      .setFooter({ text: `Berakhir dalam ${durasi} detik` })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId('join_giveaway')
      .setLabel('Ikut Giveaway')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const participants = new Set();

    const collector = msg.createMessageComponentCollector({ time: durasi * 1000 });

    collector.on('collect', i => {
      if (!participants.has(i.user.id)) {
        participants.add(i.user.id);
        i.reply({ content: 'Kamu berhasil ikut giveaway!', ephemeral: true });
      } else {
        i.reply({ content: 'Kamu sudah ikut sebelumnya!', ephemeral: true });
      }
    });

    collector.on('end', async () => {
      const winner = [...participants][Math.floor(Math.random() * participants.size)];

      const resultEmbed = new EmbedBuilder()
        .setTitle('🎊 GIVEAWAY SELESAI 🎊')
        .setDescription(winner ? `Pemenangnya adalah: <@${winner}>` : 'Tidak ada yang ikut giveaway.')
        .setColor(0xFFD700);

      await interaction.editReply({ embeds: [resultEmbed], components: [] });
    });
  }
};
