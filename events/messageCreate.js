const prefix = '!';

module.exports = {
  name: 'messageCreate',

  async execute(message, client) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Cek apakah command ada langsung, atau sebagai alias
    const actualCommandName = client.commands.has(commandName)
      ? commandName
      : client.aliases.get(commandName);

    const command = client.commands.get(actualCommandName);

    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('Terjadi error saat menjalankan command.');
    }
  }
};