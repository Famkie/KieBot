// utils/lottoStore.js

let currentLotto = null;
let lottoEntries = [];
let lottoStats = {};

module.exports = {
  setCurrentLotto(data) {
    currentLotto = data;
  },
  getCurrentLotto() {
    return currentLotto;
  },
  clearCurrentLotto() {
    currentLotto = null;
    lottoEntries = [];
  },
  addEntry(entry) {
    lottoEntries.push(entry);
  },
  getEntries() {
    return lottoEntries;
  },
  getEntryById(id) {
    return lottoEntries.find(e => e.id === id);
  },
  getEntryCount() {
    return lottoEntries.length;
  },
  addStat(userId) {
    lottoStats[userId] = (lottoStats[userId] || 0) + 1;
  },
  getStats() {
    return lottoStats;
  }
};