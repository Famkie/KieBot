const fetch = require('node-fetch');

async function fetchTornData(endpoint = 'user', selections = 'basic', apiKey) {
  const url = `https://api.torn.com/${endpoint}/?selections=${selections}&key=${apiKey}`;
  const res = await fetch(url);
  return await res.json();
}

module.exports = fetchTornData;