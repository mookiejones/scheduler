import SocketActions from './SocketActions';
import URLS from './Urls';

import Actions from './Actions';
import OsOptions from './OsOptions';
const { version } = require('../../../package.json');

const ADD_USER = 'ADD_USER';
const DELETE = 'DELETE';
const UPDATE = 'UPDATE';
const AVAILABLE = '##AVAILABLE##';
const ASSIST = 'assist';
const PRODUCTION = 'production';
const STAGE = 'stage';
const WATCH = 'watch';
const LOAD = 'load';
const UNDO_KEY = 'undo';
const ROUND_KEY = 'round';
const INSERT = 'INSERT';
const TEST_REAL = true;

export {
  ADD_USER,
  SocketActions,
  URLS,
  Actions,
  version as VERSION,
  DELETE,
  UPDATE,
  AVAILABLE,
  ASSIST,
  PRODUCTION,
  STAGE,
  WATCH,
  LOAD,
  UNDO_KEY,
  ROUND_KEY,
  INSERT,
  OsOptions,
  TEST_REAL
};
