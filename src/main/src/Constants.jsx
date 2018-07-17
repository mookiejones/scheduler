const DELETE_KEY = 'DELETE';

const TEST = true;
const IS_TEST = true;
const PRODUCTION = false;
const AVAILABLE = '##AVAILABLE##';
const VERSION_NUMBER = '1.3.1';
const RECONNECT = 'reconnect';
const RECONNECTED = 'reconnected';
const CONNECTED = 'connected';
const DISCONNECTED = 'disconnected';
const UPDATE_NOTIFY = 'update-notify';
const ROWUPDATE = 'rowupdate';
const NEW_ROW = 'newrow';
const ROW_DELETE = 'rowdelete';

const TEMP = 'Temp';
const ASSIST = 'assist';
const STAGE = 'stage';
const LOAD = 'load';

/**
 * Number of seconds for data to refresh
 */
const REFRESH_RATE = 10;
const API_SERVER = PRODUCTION ? 'http://nord:5555' : 'http://localhost:5555';

// Constant keys for all string values

const DELETE_COLOR_RULE = 'DeleteColorRule';

class ConnectionStates {
  static get NewRow() {
    return NEW_ROW;
  }

  static get RowDelete() {
    return ROW_DELETE;
  }

  static get RowUpdate() {
    return ROWUPDATE;
  }

  static get Reconnect() {
    return RECONNECT;
  }

  static get Reconnected() {
    return RECONNECTED;
  }

  static get Connected() {
    return CONNECTED;
  }

  static get Disconnected() {
    return DISCONNECTED;
  }

  static get UpdateNotify() {
    return UPDATE_NOTIFY;
  }
}

class OS {
  static getOSVersion() {
    const os = OS.UNKNOWN;
    const version = navigator.appVersion;
    if (/Win/.test(version)) return OS.WINDOWS;
    if (/Mac/.test(version)) return OS.MAC_OS;
    if (/X11/.test(version)) return OS.X11;
    if (/Linux/.test(version)) return OS.LINUX;

    return os;
  }

  static get UNKNOWN() {
    return 'Unkown OS';
  }

  static get WINDOWS() {
    return 'Windows';
  }

  static get MAC_OS() {
    return 'MacOS';
  }

  static get X11() {
    return 'X11';
  }

  static get LINUX() {
    return 'Linux';
  }
}

const GET_PAINT_SCHEDULE = 'GetPaintSchedule';
const GET_PROGRAM_COLORS = 'GetProgramColors';
const PAINT_SCHEDULE_STYLES = 'GetPaintScheduleStyles';
const SCHEDULE_NEW_ROUND = 'ScheduleNewRound';
const GET_PAINT_PICKLIST = 'GetPaintPickList';
const VERIFY_EMPLOYEE_ID = 'GetEmployee';

class Constants {
  static get VerifyEmployee() {
    return VERIFY_EMPLOYEE_ID;
  }

  static get PaintPickList() {
    return GET_PAINT_PICKLIST;
  }

  static get Temp() {
    return TEMP;
  }

  static get Test() {
    return TEST;
  }

  static get Production() {
    return PRODUCTION;
  }

  static get AVAILABLE() {
    return AVAILABLE;
  }

  static get Version() {
    return VERSION_NUMBER;
  }

  static get DeleteColorRule() {
    return DELETE_COLOR_RULE;
  }

  static get GetPaintSchedule() {
    return GET_PAINT_SCHEDULE;
  }

  static get GetProgramColors() {
    return GET_PROGRAM_COLORS;
  }

  static get PaintScheduleStyles() {
    return PAINT_SCHEDULE_STYLES;
  }

  static get ScheduleNewRound() {
    return SCHEDULE_NEW_ROUND;
  }
}

export {
  ASSIST,
  STAGE,
  LOAD,
  ConnectionStates,
  Constants,
  PRODUCTION,
  DELETE_KEY,
  API_SERVER,
  AVAILABLE,
  REFRESH_RATE,
  VERSION_NUMBER,
  TEST,
  IS_TEST,
  OS
};
