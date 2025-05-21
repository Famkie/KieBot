// utils/lottoDraw.js

const { getEntries, clearCurrentLotto, getCurrentLotto, addStat } = require('./lottoStore');

function drawLotto() {
  const entries = getEntries();
  const lotto = getCurrentLotto();

  if (!lotto || entries.length === 0) return null;

  const winnerIndex = Math.floor(Math.random() * entries.length);
  const winner = entries[winnerIndex];

  addStat(winner.id); // menambahkan statistik untuk leaderboard

  const result = {
    prize: lotto.prize,
    host: lotto.host,
    winner,
    entries,
    total: entries.length
  };

  clearCurrentLotto(); // reset setelah draw

  return result;
}

module.exports = { drawLotto };