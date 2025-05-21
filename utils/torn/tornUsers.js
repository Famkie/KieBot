const fs = require('fs').promises;
const path = require('path');

const filePath = path.resolve(__dirname, '../data/tornUsers.json');

// Pastikan file json ada, kalau belum maka buat
async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify({ }, null, 2));
  }
}

async function getTornUser(userId) {
  await ensureFile();

  const data = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(data);
  return users[userId] || null;
}

async function setTornUser(userId, key) {
  await ensureFile();

  const data = await fs.readFile(filePath, 'utf-8');
  const users = JSON.parse(data);

  users[userId] = { key };
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

module.exports = {
  getTornUser,
  setTornUser
};
