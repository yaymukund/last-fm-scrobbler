let _config = {},
    _EXCLUDED_KEYS = ['format', 'callback'];

let _setRequiredParam = (config, param) => {
  if (!config[param]) {
    throw new Error(`Required parameter ${param} missing.`);
  }

  _config[param] = config[param];
};

let configure = function(config) {
  _setRequiredParam(config, 'apiKey');
  _setRequiredParam(config, 'secret');
  _setRequiredParam(config, 'sessionKey');
  _setRequiredParam(config, 'md5');
};

let sign = function(options) {
  options.api_key = _config.apiKey;
  options.sk = _config.sessionKey;

  let keys = Object.keys(options).sort(),
      str = '';

  keys.forEach(key => {
    if (_EXCLUDED_KEYS.indexOf(key) !== -1) {
      return;
    }

    str += `${key}${options[key]}`;
  });

  str += _config.secret;
  options.api_sig = _config.md5(str);
};

export {
  configure,
  sign
};
