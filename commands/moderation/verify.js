import fs from 'fs';
import path from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tornUsersPath = path.join(__dirname, '..', 'data', 'tornUsers.json');

export const data = new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Verifikasi akun Torn City kamu')
  .addStringOption(option =>
    option.setName('tornid')
      .setDescription('ID Torn City kamu')
      .setRequired(true)
  );

export async function execute(interaction) {
  const discordId = interaction.user.id;
  const tornId = interaction.options.getString('tornid');

  let users = [];
  if (fs.existsSync(tornUsersPath)) {
    users = JSON.parse(fs.readFileSync(tornUsersPath, 'utf8'));
  }

  const existing = users.find(u => u.discordId === discordId);
  if (existing) {
    return interaction.reply({ content: 'Kamu sudah terverifikasi!', ephemeral: true });
  }

  users.push({ discordId, tornId });
  fs.writeFileSync(tornUsersPath, JSON.stringify(users, null, 2));

  return interaction.reply({ content: `Berhasil verifikasi sebagai Torn ID: ${tornId}`, ephemeral: true });
}
