// handlers/loadButtons.js
export default async (client) => {
  client.buttons = new Map();

  const buttons = [
    // contoh manual registration
    { id: 'giveaway_join', execute: async (interaction) => { /*...*/ } },
    { id: 'giveaway_leave', execute: async (interaction) => { /*...*/ } },
  ];

  for (const btn of buttons) {
    client.buttons.set(btn.id, btn);
  }
};
