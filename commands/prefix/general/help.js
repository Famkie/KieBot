// commands/prefix/general/help.js

import { EmbedBuilder } from 'discord.js';

export const name = 'fitur';
export const aliases = ['features', 'help'];
export const description = 'Menampilkan daftar fitur bot yang tersedia';

export async function execute(message, args) {
  const embed = new EmbedBuilder()
    .setTitle('Fitur Terkini Bot')
    .setColor('Random')
    .setDescription('Berikut adalah fitur yang sudah tersedia di bot:')
    .addFields(
      { name: '🎉 Giveaway', value: '`!gstart <durasi> <jumlah> <hadiah>`\nMulai giveaway otomatis.' },
      { name: '⭐ Karma Point', value: '`!gg`\nMemberikan poin karma ke pengguna lain.' },
      { name: '🔁 Alias Command', value: 'Gunakan alias seperti `!gw`, `!features`, dll.' },
      { name: '📁 Command Handler', value: 'Struktur modular per folder dan event.' },
      { name: '⚙️ Slash Command', value: 'Gunakan `/fitur`, `/gstart`, dll secara native Discord.' },
      { name: '🌐 Keep Alive', value: 'Bot tetap aktif di Cybrancee / Replit.' }
    )
    .setFooter({ text: 'Bot by Kamu' });

  message.reply({ embeds: [embed] });
}
