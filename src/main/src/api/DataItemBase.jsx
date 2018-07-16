import fetch from 'node-fetch';
import {
 API_SERVER, TEST, IS_TEST, PRODUCTION
} from '../Constants';
import { stringify } from '../../node_modules/postcss';

const isArray = item => Object.prototype.toString.call(item) === '[object Array]';
const sortFn = (a, b) => {
  const roundA = parseInt(a[2], 10);
  const posA = parseInt(a[3], 10);
  const roundB = parseInt(b[2], 10);
  const posB = parseInt(b[3], 10);
  const qtyA = parseInt(a[9], 10);
  const qtyB = parseInt(b[9], 10);

  if (roundA === roundB) {
    // if round is the same, sort by round_position
    if (posA === posB) {
      if (qtyA < qtyB) {
        return -1;
      }
      if (qtyA > qtyB) {
        return 1;
      }
      return 0;
    }
    return posA < posB ? -1 : 1;
  }
  return roundA < roundB ? -1 : 1;
};

export default class DataItemBase {
  url(name) {
    const path = IS_TEST ? `${name}Test` : name;
    return `${API_SERVER}/${path}`;
  }

  static getDataPromise(url) {
    return new Promise(resolve => resolve(DataItemBase.getData(url)));
  }

  static getData(name) {
    let path = name;

    // fix path so test goes before query
    if (/\//.test(name) && !PRODUCTION) {
      const mach = /^([^/]+)(\/.*)/gi.exec(name);
      path = `${mach[1]}Test${mach[2]}`;
    }

    const url = `${API_SERVER}/reporting/paint.asmx/${path}? HTTP/1.1`;
    return fetch(url)
      .then((r) => {
        if (!r.ok) debugger;
        return r.json();
      })

      .catch((e) => {
        console.error(e);
        debugger;
      });
  }

  static postData(name, body) {
    const url = `${API_SERVER}/reporting/paint.asmx/${name}`;

    const options = {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    return fetch(url, options);
  }
}
