import { API_SERVER } from "./Constants";

import * as debug from "debug";
const error = debug("app:error");
const log = debug("app:log");

/**
 * Determine if we are going to write output
 * depending upon the target address
 */
let enabled = /norweb\//i.test(API_SERVER);

log.enabled = !enabled;
error.enabled = !enabled;
// by default stderr is used
error("goes to stderr!");

// set this namespace to log via console.log
log.log = console.log.bind(console); // don't forget to bind to console!
error.log = console.log.bind(console);

// set all output to go via console.info
// overrides all per-namespace log settings
debug.log = console.info.bind(console);

export default class Logger {
  static log = (message) => log(message);
  static error = (message) => error(message);
}
