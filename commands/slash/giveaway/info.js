import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('giveaway-info')
  .setDescription('Tampilkan info giveaway aktif di channel ini');

export async function execute(interaction) {
  const giveaway = giveaways.get(interaction.channel.id);

  if (!giveaway) {
    return interaction.reply({ content: 'Tidak ada giveaway aktif di channel ini.', ephemeral: true });
  }

  const peserta = giveaway.participants.size;
  const waktuTersisa = Math.max(0, giveaway.endsAt - Date.now());

  const menit = Math.floor(waktuTersisa / 60000);
  const detik = Math.floor((waktuTersisa % 60000) / 1000);

  const embed = {
    title: 'Info Giveaway Aktif',
    description: `Hadiah: **${giveaway.hadiah}**\nPeserta: **${peserta}** orang\nWaktu tersisa: **${menit} menit ${detik} detik**`,
    color: 0x3498db,
  };

  return interaction.reply({ embeds: [embed], ephemeral: true });
} 
