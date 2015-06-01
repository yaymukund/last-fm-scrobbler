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

let toFormData = function(obj) {
  let formData = new FormData();

  Object.keys(obj).forEach(k => {
    formData.append(k, obj[k]);
  });

  return formData;
};

let filterParams = function(params, keys) {
  let _p = {};

  if (keys.required) {
    keys.required.forEach(i => {
      if (!params[i]) {
        throw new Error(`Missing required parameter: ${i}`);
      }

      _p[i] = params[i];
    });
  }

  if (keys.optional) {
    keys.optional.forEach(i => {
      if (params[i]) { _p[i] = params[i]; }
    });
  }

  return _p;
};

let toQueryParams = function(params) {
  let args = [];

  Object.keys(params).forEach(k => {
    args.push(`${k}=${params[k]}`);
  });

  return args.join('&');
};

export {
  configure,
  _config as config,
  toFormData,
  filterParams,
  toQueryParams,
  sign
};
