let currentLotto = null;
let lottoEntries = [];
let lottoStats = {};

export function setCurrentLotto(data) {
  currentLotto = data;
}

export function getCurrentLotto() {
  return currentLotto;
}

export function clearCurrentLotto() {
  currentLotto = null;
  lottoEntries = [];
}

export function addEntry(entry) {
  lottoEntries.push(entry);
}

export function getEntries() {
  return lottoEntries;
}

export function getEntryById(id) {
  return lottoEntries.find(e => e.id === id);
}

export function getEntryCount() {
  return lottoEntries.length;
}

export function addStat(userId) {
  lottoStats[userId] = (lottoStats[userId] || 0) + 1;
}

export function getStats() {
  return lottoStats;
}
