const CONFIG = require('./config');
const fetch = require('node-fetch');

module.exports = async function () {
  const encodedCredentials = Buffer.from(
    `${CONFIG.clientId}:${CONFIG.clientSecret}`
  ).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
  });

  const response = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
      },
      body,
    }
  );

  return await response.json();
};
