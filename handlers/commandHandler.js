const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandFolders = fs.readdirSync('./commands');

  for (const folder of commandFolders) {
    const folderPath = path.join(__dirname, '..', 'commands', folder);

    if (fs.lstatSync(folderPath).isDirectory()) {
      const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if (command.name) {
          client.commands.set(command.name, command);
          console.log(`[Command] Loaded: ${command.name}`);
        }
      }
    } else if (folder.endsWith('.js')) {
      const command = require(path.join(__dirname, '..', 'commands', folder));
      if (command.name) {
        client.commands.set(command.name, command);
        console.log(`[Command] Loaded: ${command.name}`);
      }
    }
  }
};