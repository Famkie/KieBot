// commands/lotto/sl.js 

const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js'); const lottoStore = require('../../utils/lottoStore'); const { getTornUser } = require('../../utils/tornUsers'); const fetchTornData = require('../../utils/fetchTorn');

module.exports = { data: new SlashCommandBuilder() .setName('sl') .setDescription('Start a new lotto'),

async execute(interaction) { await interaction.deferReply();

const tornUser = getTornUser(interaction.user.id);
if (!tornUser) return interaction.editReply('Akun kamu belum terhubung dengan Torn City. Gunakan `/tcverify` terlebih dahulu.');

const profile = await fetchTornData('user', 'basic,profile', tornUser.key);
if (profile.error) return interaction.editReply(`Gagal mengambil data Torn: ${profile.error}`);

if (lottoStore.activeLotto) return interaction.editReply('Masih ada undian yang aktif. Selesaikan dulu.');

const hostName = `${profile.name} [${profile.player_id}]`;
const prize = 'cape tiap hari od';

lottoStore.activeLotto = {
  host: hostName,
  prize,
  entries: []
};

const embed = new EmbedBuilder()
  .setTitle(`🎉 ${hostName} has started a lotto! 🎉`)
  .setDescription(`Use !j to enter for a chance to win ${prize}!`)
  .setColor('Green');

const joinButton = new ButtonBuilder()
  .setCustomId('join_lotto')
  .setLabel('Join')
  .setStyle(ButtonStyle.Primary);

const row = new ActionRowBuilder().addComponents(joinButton);

await interaction.editReply({ content: `There is a lotto running <@&LottoHunter>!`, embeds: [embed], components: [row] });

} };

