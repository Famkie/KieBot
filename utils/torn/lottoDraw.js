// utils/torn/lottoDraw.js
import { getEntries, clearCurrentLotto, getCurrentLotto, addStat } from './lottoStore.js';

export function drawLotto() {
  const entries = getEntries();
  const lotto = getCurrentLotto();

  if (!lotto || entries.length === 0) return null;

  const winnerIndex = Math.floor(Math.random() * entries.length);
  const winner = entries[winnerIndex];

  addStat(winner.id); // Tambahkan statistik untuk leaderboard

  const result = {
    prize: lotto.prize,
    host: lotto.host,
    winner,
    entries,
    total: entries.length
  };

  clearCurrentLotto(); // Reset setelah draw

  return result;
}

export function drawWinners(client, channel) {
  const result = drawLotto();

  if (!result) {
    channel.send("Gagal melakukan undian. Mungkin tidak ada entri?");
    return;
  }

  channel.send(
    `**Lotto telah diundi!**\n` +
    `Pemenang: <@${result.winner.id}>\n` +
    `Hadiah: $${result.prize.toLocaleString()}\n` +
    `Jumlah Peserta: ${result.total}`
  );
}
