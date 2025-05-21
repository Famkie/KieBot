// commands/lotto/draw.js 
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); const lottoStore = require('../../utils/lottoStore');

module.exports = { data: new SlashCommandBuilder() .setName('draw') .setDescription('Draw the winner(s) of the current lotto'),

async execute(interaction) { const lotto = lottoStore.activeLotto; if (!lotto) return interaction.reply('Tidak ada undian aktif.');

if (lotto.entries.length < 1) return interaction.reply('Belum ada peserta yang ikut.');

// Shuffle peserta
const shuffled = lotto.entries.sort(() => 0.5 - Math.random());
const winners = shuffled.slice(0, lotto.winners);

const winnerText = winners.map((w, i) => `**${i + 1}.** ${w.username} [${w.tornId}]`).join('\n');

const embed = new EmbedBuilder()
  .setTitle(`Lotto Draw - ${lotto.prize}`)
  .setDescription(`Pemenang (${lotto.winners}):\n${winnerText}`)
  .setColor('Gold')
  .setTimestamp();

await interaction.reply({ embeds: [embed] });

// Reset
lottoStore.activeLotto = null;

} };

