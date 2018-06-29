import * as io from "socket.io-client";
import { API_SERVER } from "../Constants";

class SocketScheduler {
  constructor(isTesting) {
    const url = `${API_SERVER}/paint-load`;
    this.socket = io(url);
  }

  get isConnected() {
    return this.socket.connected ? "connected" : "disconnected";
  }

  subscribe(name, callback) {
    this.socket.on(name, (msg) => {
      callback(msg);
    });
  }
}
export default new SocketScheduler(true);
