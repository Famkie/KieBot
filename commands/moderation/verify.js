const fs = require('fs');
const path = require('path');

const tornUsersPath = path.join(__dirname, '..', 'data', 'tornUsers.json');

module.exports = {
  name: 'verify',
  description: 'Verifikasi akun Torn City kamu',
  options: [
    {
      name: 'tornid',
      type: 3, // STRING
      description: 'ID Torn City kamu',
      required: true,
    },
  ],
  slashExecute: async (interaction) => {
    const discordId = interaction.user.id;
    const tornId = interaction.options.getString('tornid');

    // Load existing users
    let users = [];
    if (fs.existsSync(tornUsersPath)) {
      users = JSON.parse(fs.readFileSync(tornUsersPath, 'utf8'));
    }

    // Cek jika sudah pernah verif
    const existing = users.find((u) => u.discordId === discordId);
    if (existing) {
      return interaction.reply({ content: 'Kamu sudah terverifikasi!', ephemeral: true });
    }

    // Tambahkan ke file
    users.push({ discordId, tornId });
    fs.writeFileSync(tornUsersPath, JSON.stringify(users, null, 2));

    return interaction.reply({ content: `Berhasil verifikasi sebagai Torn ID: ${tornId}`, ephemeral: true });
  },
};