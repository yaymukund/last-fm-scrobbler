import { sign } from './helpers';

let API_URL = 'http://ws.audioscrobbler.com/2.0/',
    TAGS = {
      required: [
        'artist',
        'track'
      ],

      optional: [
        'album',
        'trackNumber',
        'context',
        'mbid',
        'duration',
        'albumArtist'
      ]
    };

let scrobble = function(tags) {
  let params = {};

  TAGS.required.forEach(i => {
    if (!tags[i]) {
      throw new Error(`Missing required parameter: ${i}`);
    }

    params[i] = tags[i];
  });

  TAGS.optional.forEach(i => {
    if (tags[i]) { params[i] = tags[i]; }
  });

  sign(params);

  fetch(API_URL, {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

};
