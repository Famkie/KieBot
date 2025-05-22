import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const giveaways = new Map(); // Temp storage, bisa kamu pindah ke DB

export default {
  data: new SlashCommandBuilder()
    .setName('giveaway-start')
    .setDescription('Mulai giveaway baru')
    .addStringOption(option => 
      option.setName('hadiah')
            .setDescription('Hadiah giveaway')
            .setRequired(true))
    .addIntegerOption(option =>
      option.setName('durasi')
            .setDescription('Durasi giveaway dalam menit')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(1440))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const hadiah = interaction.options.getString('hadiah');
    const durasi = interaction.options.getInteger('durasi');

    const channel = interaction.channel;

    if (giveaways.has(channel.id)) {
      return interaction.reply({ content: 'Sudah ada giveaway aktif di channel ini!', ephemeral: true });
    }

    const endsAt = Date.now() + durasi * 60000;
    
    const embed = {
      title: '🎉 GIVEAWAY DIMULAI! 🎉',
      description: `Hadiah: **${hadiah}**\nDurasi: ${durasi} menit\nKlik tombol untuk ikut!`,
      color: 0x00FF00,
      footer: { text: `Berakhir: ${new Date(endsAt).toLocaleString()}` },
    };

    const row = {
      type: 1,
      components: [{
        type: 2,
        style: 1,
        custom_id: 'giveaway_join',
        label: 'Ikut Giveaway',
        emoji: '🎁',
      }],
    };

    const message = await channel.send({ embeds: [embed], components: [row] });

    giveaways.set(channel.id, {
      messageId: message.id,
      hadiah,
      endsAt,
      participants: new Set(),
      channelId: channel.id,
      timeout: setTimeout(() => endGiveaway(channel.id, interaction.client), durasi * 60000),
    });

    await interaction.reply({ content: `Giveaway dimulai! Hadiah: **${hadiah}**`, ephemeral: true });
  }
};

async function endGiveaway(channelId, client) {
  const giveaway = giveaways.get(channelId);
  if (!giveaway) return;

  const channel = await client.channels.fetch(giveaway.channelId);
  if (!channel) return;

  try {
    const message = await channel.messages.fetch(giveaway.messageId);
    if (!message) return;

    const participantsArr = Array.from(giveaway.participants);
    let winnerMsg;
    if (participantsArr.length === 0) {
      winnerMsg = 'Sayang sekali, tidak ada yang ikut giveaway ini.';
    } else {
      const winnerId = participantsArr[Math.floor(Math.random() * participantsArr.length)];
      winnerMsg = `<@${winnerId}> memenangkan giveaway dengan hadiah **${giveaway.hadiah}**! Selamat!`;
    }

    const embed = {
      title: '🎉 GIVEAWAY SELESAI 🎉',
      description: winnerMsg,
      color: 0xFFD700,
    };

    await message.edit({ embeds: [embed], components: [] });
  } catch (error) {
    console.error('Gagal update message giveaway:', error);
  }

  giveaways.delete(channelId);
}
