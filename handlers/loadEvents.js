export default async (client) => {
  const eventsPath = path.join(__dirname, '..', 'events');
  const folders = fs.readdirSync(eventsPath);

  for (const folder of folders) {
    const folderPath = path.join(eventsPath, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const eventModule = await import(filePath);
      const event = eventModule.default;

      if (event?.name && typeof event.execute === 'function') {
        if (event.once) {
          client.once(event.name, (...args) => {
            if (event.name === 'ready') {
              event.execute(client);
            } else {
              event.execute(client, ...args);
            }
          });
        } else {
          client.on(event.name, (...args) => {
            if (event.name === 'ready') {
              event.execute(client);
            } else {
              event.execute(client, ...args);
            }
          });
        }
      }
    }
  }
};
