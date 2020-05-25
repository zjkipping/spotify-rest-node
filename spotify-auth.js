const CONFIG = require('./config');
const fetch = require('node-fetch');

module.exports = async function () {
  const encodedCredentials = Buffer.from(
    `${CONFIG.clientId}:${CONFIG.clientSecret}`
  ).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
  });

  try {
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

    if (!response.ok) {
      console.log(await response.text());
      return null;
    }

    const auth = await response.json();

    console.log(auth);

    return auth;
  } catch (err) {
    console.log(err);
    return null;
  }
};
