import {
  sign,
  config,
  toFormData,
  filterParams,
  toQueryParams
} from './helpers';

let API_URL = 'http://ws.audioscrobbler.com/2.0/';

let scrobble = function(tags) {
  let params = filterParams(tags, {
    required: [
      'artist',
      'track',
      'timestamp'
    ],
    optional: [
      'album',
      'trackNumber',
      'context',
      'mbid',
      'duration',
      'albumArtist'
    ]
  });

  params['format=json'] = config.apiKey;
  params.method = 'track.scrobble';
  params.sk = config.sessionKey;
  sign(params);

  return fetch(API_URL, {
    method: 'post',
    body: toFormData(params)
  });
};

let getToken = function() {
  let params = sign({
    method: 'auth.getToken',
    api_key: config.apiKey
  });

  return fetch(API_URL + '?' + toQueryParams(params));
};

let getSession = function(token) {
  let params = sign({
    method: 'auth.getSession',
    token: token,
    api_key: config.apiKey
  });

  return fetch(API_URL + '?' + toQueryParams(params));
};

export {
  scrobble,
  getToken,
  getSession
};
