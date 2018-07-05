import * as io from "socket.io-client";
import { API_SERVER } from "../Constants";
import * as debug from "debug";

const connect_error = "connect_error";
const connect_timeout = "connect_timeout";

const reconnect = "reconnect";
const reconnect_attempt = "reconnect_attempt";
const reconnecting = "reconnecting";
const reconnect_error = "reconnect_error";
const reconnect_failed = "reconnect_failed";
const ping = "ping";
const pong = "pong";

const log = debug("app:connection");
log.log = console.log.bind(console); // don't forget to bind to console!
log.enabled = /norweb\//i.test(API_SERVER);

class SocketScheduler {
  constructor(isTesting) {
    const url = `${API_SERVER}/paint-load`;
    this.subscriptions = [];
    this.socket = io(url);
    this.initialize();
  }

  initialize() {
    log("Initializing Socket Scheduler");

    this.socket.on(connect_timeout, (a) => {
      log("connect_timeout");
    });

    this.socket.on(reconnect, (a) => {
      log("Reconnected");
    });

    this.socket.on(connect_error, (error) => {
      log("Connect Error" + error);
    });

    this.socket.on(reconnect_attempt, (attempt) => {
      log(`Reconnection attempt #${attempt}`);
    });

    this.socket.on(reconnecting, (a) => {
      log("Reconnecting");
    });

    this.socket.on("connect", (a) => {
      log("Connected");
    });

    this.socket.on(reconnect_error, (error) => {
      log(error);
    });

    this.socket.on(reconnect_failed, (a) => {
      debugger;
    });

    this.socket.on(ping, () => {
      log("Pinging Server");
    });

    this.socket.on(pong, (ms) => {
      log(`${ms} have elapsed since ping`);
    });
  }

  get isConnected() {
    return this.socket.connected;
  }

  unsubscribe(obj) {
    debugger;
    for (let listener of this.subscriptions)
      this.socket.off(listener, () => {
        debugger;
      });

    debugger;
  }

  subscribe(name, callback) {
    let item = this.subscriptions.find((o) => o == name);
    if (!item) {
      this.subscriptions.push(name);
    } else {
      debugger;
    }
    this.socket.on(name, (msg) => {
      callback(msg);
    });
  }
}
export default new SocketScheduler(true);
