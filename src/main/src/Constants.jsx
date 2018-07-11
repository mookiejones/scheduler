const DELETE_KEY = "DELETE";

const TEST = "True";
const PRODUCTION = true;
const AVAILABLE = "##AVAILABLE##";
const VERSION_NUMBER = "1.3.1";
const RECONNECT = "reconnect";
const RECONNECTED = "reconnected";
const CONNECTED = "connected";
const DISCONNECTED = "disconnected";
const UPDATE_NOTIFY = "update-notify";
const ROWUPDATE = "rowupdate";
const NEW_ROW = "newrow";
const ROW_DELETE = "rowdelete";

const TEMP = "Temp";
const ASSIST = "assist";
const STAGE = "stage";
const LOAD = "load";
/**
 * Number of seconds for data to refresh
 */
const REFRESH_RATE = 10;
let API_SERVER = "http://nord:5555";
if (!PRODUCTION) {
  API_SERVER = "http://localhost:5555";
}

// Constant keys for all string values

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
  static getOSVersion = () => {
    let os = OS.UNKNOWN;
    let version = navigator.appVersion;
    if (/Win/.test(version)) return OS.WINDOWS;
    if (/Mac/.test(version)) return OS.MAC_OS;
    if (/X11/.test(version)) return OS.X11;
    if (/Linux/.test(version)) return OS.LINUX;

    return os;
  };

  static get UNKNOWN() {
    return "Unkown OS";
  }
  static get WINDOWS() {
    return "Windows";
  }
  static get MAC_OS() {
    return "MacOS";
  }
  static get X11() {
    return "X11";
  }
  static get LINUX() {
    return "Linux";
  }
}

class Constants {
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
  OS
};
