import * as io from "socket.io-client";

class SocketScheduler {
  constructor(isTesting) {
    const url = isTesting
      ? "http://localhost:5555/paint-load"
      : "http://normagnaapps1:5555/paint-load";
    this.socket = io(url);
  }

  subscribe(name, callback) {
    this.socket.on(name, (msg) => {
      callback(msg);
    });
  }
}
export default new SocketScheduler(true);
