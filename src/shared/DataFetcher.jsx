import fetch from 'node-fetch';
import { TEST_REAL } from './Constants';

const debug = require('debug')('fetch');

const IsTest = /(?:localhost|test)/.test(window.location.hostname);
const WEB = 'http://norweb/reporting/scheduling.asmx/';
const _options = (body = {}, method = 'POST') => {
  const keys = Object.keys(body);
  let values = keys.map((key) => `${key}=${body[key]}`);

  const bodyString = values.join('&');
  return {
    method: method,
    body: bodyString,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(JSON.stringify(bodyString))
    }
  };
};
export { _options as options };

const regex = new RegExp(WEB, 'ig');

const formatUrl = (url, env) => {
  if (!regex.test(url)) url = `${WEB}${url}`;
  if (TEST_REAL) console.warn('Testing real');
  if (IsTest && !TEST_REAL) url += 'Test';

  return url;
};

const Fetch = (url, env, options) => {
  console.log(url);
  debug('fetch', url);
  if (options) {
    if (typeof options === 'object' && Object.keys(options).length !== 3) {
      options = _options(options);
    }
  }
  options = options || _options();

  url = formatUrl(url, env);

  return fetch(url, options).then((response) => {
    if (!response.ok) {
      console.error(`There was an error trying to get ${response.url}`);
      throw new Error(JSON.stringify(response));
    }
    if (response.ok && response.status >= 200) {
      return response
        .text()
        .then((o) => {
          const text = o
            .trim()
            .replace(
              /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g,
              ''
            )
            .trim();

          const json = JSON.parse(text);

          // Check to see if item is Array
          if (Array.isArray(json)) {
            // Item is array, but check to see if it a result element
            let first =
              typeof json[0] === 'string' ? JSON.parse(json[0]) : json[0];

            if (
              first['value'] !== undefined &&
              first['numChanged'] !== undefined &&
              first['newId'] !== undefined
            ) {
              return first;
            }
          }
          return json;
        })
        .catch(Fetch.ErrorHandler);
    }
    debugger;
  });
};

Fetch.ErrorHandler = (error) => {
  debugger;
  console.error(error);
};

export default Fetch;
