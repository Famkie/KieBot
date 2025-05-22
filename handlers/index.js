// handlers/index.js
import loadEvents from './loadEvents.js';
import loadSlashCommands from './loadSlashCommands.js';
import loadPrefixCommands from './loadPrefixCommands.js';

export default async (client) => {
  await loadEvents(client);
  await loadSlashCommands(client);
  await loadPrefixCommands(client);
  // tambahin loadButtons/loadModals kalau perlu
}; 
