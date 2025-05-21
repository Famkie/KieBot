import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('rerollgiveaway')
  .setDescription('Pilih ulang pemenang dari giveaway yang sudah berjalan')
  .addStringOption(opt =>
    opt.setName('message_id')
      .setDescription('ID pesan giveaway')
      .setRequired(true)
  );

export async function execute(interaction) {
  const messageId = interaction.options.getString('message_id');
  const giveaway = interaction.client.giveaways.get(messageId);

  if (!giveaway) {
    return interaction.reply({
      content: '❌ Giveaway tidak ditemukan.',
      ephemeral: true,
    });
  }

  const participants = [...(giveaway.participants || [])];

  if (participants.length === 0) {
    return interaction.reply({
      content: '⚠️ Tidak ada peserta dalam giveaway ini.',
      ephemeral: true,
    });
  }

  const winnerId = participants[Math.floor(Math.random() * participants.length)];

  const embed = new EmbedBuilder()
    .setTitle('🔁 Giveaway Reroll')
    .setDescription(`Pemenang baru: <@${winnerId}>`)
    .setColor(0x1abc9c)
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
