import * as io from "socket.io-client";
import { API_SERVER } from "../Constants";

class SocketScheduler {
  constructor(isTesting) {
    debugger;
    const url = `${API_SERVER}/paint-load`;
    this.socket = io(url);
  }

  subscribe(name, callback) {
    this.socket.on(name, msg => {
      callback(msg);
    });
  }
}
export default new SocketScheduler(true);
