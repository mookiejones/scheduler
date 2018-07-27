import fetch from 'node-fetch';
import DefaultUser from './DefaultUser';

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

  if (IsTest) url += 'Test';

  return url;
};

const Fetch = (url, env, options) => {
  console.log(url);
  if (
    (/Employee/i.test(url) || /VerifyEmpID/i.test(url)) &&
    env === 'development'
  )
    return new Promise((resolve, reject) => {
      resolve(DefaultUser);
    });
  if (options) {
    if (typeof options === 'object' && Object.keys(options).length !== 3) {
      options = _options(options);
    }
  }
  options = options || _options();

  url = formatUrl(url, env);

  return fetch(url, options).then((response) => {
    if (!response.ok) {
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
