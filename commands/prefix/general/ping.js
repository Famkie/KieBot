// commands/prefix/general/ping.js
export const name = 'ping';
export const description = 'Cek latency bot.';

export async function execute(message, args) {
  try {
    const sent = await message.channel.send('Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(`Pong! Latency: ${latency}ms`);
  } catch (err) {
    console.error('Ping error:', err);
    message.channel.send('Gagal melakukan ping.');
  }
} 
