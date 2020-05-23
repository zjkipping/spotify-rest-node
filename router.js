const express = require('express');
const fetch = require('node-fetch');
const getSpotifyAuth = require('./spotify-auth');

async function getTrack(query, auth) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      method: 'GET',
      headers: {
        Authorization: `${auth.token_type} ${auth.access_token}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();

  const items = payload.tracks.items;

  if (items.length > 0) {
    const trackItem = items[0];
    return {
      song: trackItem.name,
      artist: trackItem.artists.map(artist => artist.name).join(', '),
      album: trackItem.album.name,
      albumArtUrl: trackItem.album.images.reduce((prev, curr) =>
        prev.width > curr.width ? prev : curr
      ).url,
    };
  } else {
    return null;
  }
}

const router = express.Router();

const startRoutes = async () => {
  let auth = await getSpotifyAuth();

  setInterval(
    async () => (auth = await getSpotifyAuth),
    50 * 60 * 1000
  );

  router.get('/track', async (req, res) => {
    const searchQuery = req.query.title;
    if (searchQuery) {
      try {
        console.log(searchQuery);
        const track = await getTrack(searchQuery, auth);
        console.log(track);
        if (!!track) {
          res.body = track;
          res.status(200).send(track);
        } else {
          throw 'error with spotify';
        }
      } catch (err) {
        res.status(424).send({
          message: 'Spotify API failed...',
        });
      }
    } else {
      res.status(400).send({
        message: 'Please provide a Search Query for property `q`',
      });
    }
  });
};

startRoutes();

module.exports = router;
