const WINDOWS = 'Windows';
const MACOS = 'MacOS';
const UNIX = 'UNIX';
const LINUX = 'LINUX';
export default class OsOptions {
  /**
   * Gets OS Version Type
   * @param {String} version
   */
  static getOs(version) {
    let result = 'Unknown OS';
    if (/Win/.test(version)) return WINDOWS;
    if (/Mac/.test(version)) return MACOS;
    if (/X11/.test(version)) return UNIX;
    if (/Linux/.test(version)) return LINUX;
    return result;
  }
  static get MacOS() {
    return MACOS;
  }
  static get Unix() {
    return UNIX;
  }
  static get Linux() {
    return LINUX;
  }
  static get Windows() {
    return WINDOWS;
  }
}
