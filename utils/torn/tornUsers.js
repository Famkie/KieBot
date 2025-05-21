import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tornUsersPath = path.join(__dirname, '..', '..', 'data', 'tornUsers.json');

export function getTornUser(discordId) {
  if (!fs.existsSync(tornUsersPath)) return null;

  const raw = fs.readFileSync(tornUsersPath, 'utf8');
  const users = JSON.parse(raw);
  return users.find(user => user.discordId === discordId);
}

export function setTornUser(discordId, apiKey, username, tornId) {
  let users = [];

  if (fs.existsSync(tornUsersPath)) {
    users = JSON.parse(fs.readFileSync(tornUsersPath, 'utf8'));
  }

  const newUser = {
    discordId,
    apiKey,
    username,
    tornId,
    linkedAt: new Date().toISOString()
  };

  users.push(newUser);
  fs.writeFileSync(tornUsersPath, JSON.stringify(users, null, 2));
}
