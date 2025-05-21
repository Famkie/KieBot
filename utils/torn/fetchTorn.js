import fetch from 'node-fetch';

/**
 * Ambil data dari API Torn City.
 * @param {string} endpoint - Endpoint Torn API, contoh: 'user'
 * @param {string} selections - Selections data, contoh: 'basic,profile'
 * @param {string} apiKey - API key pengguna
 * @returns {Promise<Object>} - Data JSON dari API
 */
export default async function fetchTornData(endpoint = 'user', selections = 'basic', apiKey) {
  const url = `https://api.torn.com/${endpoint}/?selections=${selections}&key=${apiKey}`;
  const res = await fetch(url);
  return res.json();
}
