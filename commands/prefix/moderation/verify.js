import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tornUsersPath = path.join(__dirname, '..', '..', 'data', 'tornUsers.json');

export const name = 'verify';
export const description = 'Verifikasi akun Torn City kamu. Penggunaan: !verify <torn_id>';

export async function execute(message, args) {
  const discordId = message.author.id;
  const tornId = args[0];

  if (!tornId || !/^\d+$/.test(tornId)) {
    return message.reply('Masukkan Torn ID yang valid. Contoh: `!verify 1234567`');
  }

  let users = [];

  if (fs.existsSync(tornUsersPath)) {
    users = JSON.parse(fs.readFileSync(tornUsersPath, 'utf8'));
  }

  const alreadyVerified = users.find(u => u.discordId === discordId);
  if (alreadyVerified) {
    return message.reply('Kamu sudah terverifikasi sebelumnya!');
  }

  const duplicateTornId = users.find(u => u.tornId === tornId);
  if (duplicateTornId) {
    return message.reply('Torn ID ini sudah digunakan oleh user lain.');
  }

  users.push({ discordId, tornId });

  try {
    fs.writeFileSync(tornUsersPath, JSON.stringify(users, null, 2));
    message.reply(`Berhasil verifikasi sebagai Torn ID: ${tornId}`);
  } catch (err) {
    console.error(err);
    message.reply('Gagal menyimpan data verifikasi.');
  }
}
