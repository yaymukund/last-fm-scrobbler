define('last-fm-scrobbler/api', ['exports', 'last-fm-scrobbler/helpers'], function (exports, helpers) {

  'use strict';

  var API_URL = 'http://ws.audioscrobbler.com/2.0/';

  var scrobble = function scrobble(tags) {
    var params = helpers.filterParams(tags, {
      required: ['artist', 'track', 'timestamp'],
      optional: ['album', 'trackNumber', 'context', 'mbid', 'duration', 'albumArtist']
    });

    params['format=json'] = helpers.config.apiKey;
    params.method = 'track.scrobble';
    params.sk = helpers.config.sessionKey;
    helpers.sign(params);

    return fetch(API_URL, {
      method: 'post',
      body: helpers.toFormData(params)
    });
  };

  var getToken = function getToken() {
    var params = helpers.sign({
      method: 'auth.getToken',
      api_key: helpers.config.apiKey
    });

    return fetch(API_URL + '?' + helpers.toQueryParams(params));
  };

  var getSession = function getSession(token) {
    var params = helpers.sign({
      method: 'auth.getSession',
      token: token,
      api_key: helpers.config.apiKey
    });

    return fetch(API_URL + '?' + helpers.toQueryParams(params));
  };

  var updateNowPlaying = function updateNowPlaying(tags) {
    var params = helpers.filterParams(tags, {
      required: ['artist', 'track'],
      optional: ['album', 'trackNumber', 'context', 'mbid', 'duration', 'albumArtist']
    });

    params['format=json'] = helpers.config.apiKey;
    params.method = 'track.updateNowPlaying';
    params.sk = helpers.config.sessionKey;
    helpers.sign(params);

    return fetch(API_URL, {
      method: 'post',
      body: helpers.toFormData(params)
    });
  };

  exports.scrobble = scrobble;
  exports.updateNowPlaying = updateNowPlaying;
  exports.getToken = getToken;
  exports.getSession = getSession;

});
define('last-fm-scrobbler/helpers', ['exports'], function (exports) {

  'use strict';

  var _config = {},
      _EXCLUDED_KEYS = ['format', 'callback'];

  var _setRequiredParam = function _setRequiredParam(config, param) {
    if (!config[param]) {
      throw new Error('Required parameter ' + param + ' missing.');
    }

    _config[param] = config[param];
  };

  var configure = function configure(config) {
    _setRequiredParam(config, 'apiKey');
    _setRequiredParam(config, 'secret');
    _setRequiredParam(config, 'sessionKey');
    _setRequiredParam(config, 'md5');
  };

  var sign = function sign(options) {
    options.api_key = _config.apiKey;

    var keys = Object.keys(options).sort(),
        str = '';

    keys.forEach(function (key) {
      if (_EXCLUDED_KEYS.indexOf(key) !== -1) {
        return;
      }

      str += '' + key + '' + options[key];
    });

    str += _config.secret;
    options.api_sig = _config.md5(str);
  };

  var toFormData = function toFormData(obj) {
    var formData = new FormData();

    Object.keys(obj).forEach(function (k) {
      formData.append(k, obj[k]);
    });

    return formData;
  };

  var filterParams = function filterParams(params, keys) {
    var _p = {};

    if (keys.required) {
      keys.required.forEach(function (i) {
        if (!params[i]) {
          throw new Error('Missing required parameter: ' + i);
        }

        _p[i] = params[i];
      });
    }

    if (keys.optional) {
      keys.optional.forEach(function (i) {
        if (params[i]) {
          _p[i] = params[i];
        }
      });
    }

    return _p;
  };

  var toQueryParams = function toQueryParams(params) {
    var args = [];

    Object.keys(params).forEach(function (k) {
      args.push('' + k + '=' + params[k]);
    });

    return args.join('&');
  };

  exports.configure = configure;
  exports.config = _config;
  exports.toFormData = toFormData;
  exports.filterParams = filterParams;
  exports.toQueryParams = toQueryParams;
  exports.sign = sign;

});//# sourceMappingURL=last-fm-scrobbler.map