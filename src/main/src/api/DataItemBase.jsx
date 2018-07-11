<<<<<<< HEAD
import { API_SERVER, TEST } from '../Constants';
import fetch from 'node-fetch';

const search = new RegExp('^([^/]+)(.*)', 'ig');
const isArray = item => {
  return Object.prototype.toString.call(item) === '[object Array]';
};
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
      } else if (qtyA > qtyB) {
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
    let path = TEST ? `${name}Test` : name;
    return `${API_SERVER}/${path}`;
  }

  static getDataPromise = url => new Promise(resolve => resolve(DataItemBase.getData(url)));
  static getData(name) {
    let path = name;

    // fix path so test goes before query
    if (/\//.test(name) && TEST) {
      let mach = /^([^\/]+)(\/.*)/gi.exec(name);
      path = `${mach[1]}Test${mach[2]}`;
    }

    let url = `${API_SERVER}/reporting/paint.asmx/${path}? HTTP/1.1`;
    return fetch(url)
      .then(r => {
        if (!r.ok) debugger;
        return r.json();
      })

      .catch(e => {
        debugger;
      });
  }
}
=======
import { API_SERVER, TEST } from '../Constants';
import fetch from 'node-fetch';

const isArray = item => {
  return Object.prototype.toString.call(item) === '[object Array]';
};
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
      } else if (qtyA > qtyB) {
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
    let path = TEST ? `${name}Test` : name;
    return `${API_SERVER}/${path}`;
  }

  static getDataPromise(url) {
    return new Promise(resolve => resolve(DataItemBase.getData(url)));
  }
  static getData(name) {
    let path = TEST ? `${name}Test` : name;
    let url = `${API_SERVER}/reporting/paint.asmx/${path}? HTTP/1.1`;
    return fetch(url)
      .then(r => {
        if (!r.ok) debugger;
        return r.json();
      })

      .catch(e => {
        debugger;
      });
  }
}
>>>>>>> 54bff62b49d00a35bc3fb70d304925057c5a50c8
