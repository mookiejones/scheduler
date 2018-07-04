import { IconButton } from "@material-ui/core";
import { Wifi } from "@material-ui/icons";
import debug from "debug";
import * as React from 'react';
import { Component } from "react";
import { API_SERVER } from "scheduler-constants";
import io from "socket.io-client";

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
interface IState {
  connected:boolean
}

interface IProp{
  onConnectionChanged:(name:string,args:any,connected:boolean)=>void
}
/**
 * @description Component used to handle Connection Status
 */
export default class ConnectionIndicator extends Component<IProp,IState> {
  
  /**
   * @description Socket Communication
   */
  socket:SocketIOClient.Socket;

  constructor(props:IProp) {
    super(props);

    const url = `${API_SERVER}/paint-load`;
    this.socket = io(url);

    this.state = {
      connected: this.socket.connected && !this.socket.disconnected
    };
    this.onConnectedHandler = this.onConnectedHandler.bind(this);
    this.onConnectErrorHandler = this.onConnectErrorHandler.bind(this);
    this.onConnectTimeoutHandler = this.onConnectTimeoutHandler.bind(this);
    this.onErrorHandler = this.onErrorHandler.bind(this);
    this.onDisconnectedHandler = this.onDisconnectedHandler.bind(this);

    this.onReconnectHandler = this.onReconnectHandler.bind(this);
    this.onReconnectionAttemptHandler = this.onReconnectionAttemptHandler.bind(
      this
    );
    this.onReconnectingHandler = this.onReconnectingHandler.bind(this);
    this.onReconnectErrorHandler = this.onReconnectErrorHandler.bind(this);
    this.onReconnectFailedHandler = this.onReconnectFailedHandler.bind(this);
    this.onPingHandler = this.onPingHandler.bind(this);
    this.onPongHandler = this.onPongHandler.bind(this);
    this.initialize();
  }

  updateStatus(name:string, args?:any) {
    let connected = this.socket.connected && !this.socket.disconnected;
    if (this.state.connected !== connected) {
      this.setState({
        connected: connected
      });
    }

    if (this.props.onConnectionChanged) {
      this.props.onConnectionChanged(name, args, connected);
    }
  }

  /**
   * @description Fired upon a connection including a successful reconnection.
   */
  onConnectedHandler() {
    this.updateStatus("connect");
  }

  /**
   * @description Fired upon a connection error.
   * @param error error object
   */
  onConnectErrorHandler(error:Error) {
    this.updateStatus(connect_error, error);
  }
  /**
   * @description Fired upon a connection timeout.
   */
  onConnectTimeoutHandler(timeout?:any) {
    this.updateStatus(connect_timeout, timeout);
  }

  /**
   * @description Fired when an error occurs.
   * @param {Object} error error object
   */
  onErrorHandler(error:Error) {
    this.updateStatus("error",error);
  }

  /**
   * Fired upon a disconnection.
   * @param {String} reason either 'io server disconnect' or 'io client disconnect'
   */
  onDisconnectedHandler(reason:string) {
    this.updateStatus("disconnected",reason);
  }

  /**
   * @description Fired upon a successful reconnection.
   * @param {Number} attempt reconnection attempt number
   */
  onReconnectHandler(attempt:number) {
    this.updateStatus(reconnect, attempt);
  }

  /**
   * @description Fired upon an attempt to reconnect.
   * @param {Number} attempt reconnection attempt number
   */
  onReconnectionAttemptHandler(attempt:any) {
    this.updateStatus(reconnect_attempt, attempt);
  }

  /**
   * @description Fired upon an attempt to reconnect.
   * @param {Number} attempt reconnection attempt number
   */
  onReconnectingHandler(attempt:any) {
    this.updateStatus(reconnecting, attempt);
  }
  /**
   * @description Fired upon a reconnection attempt error.
   * @param {Object} error  error object
   */
  onReconnectErrorHandler(error:Error) {
    this.updateStatus(reconnect_error, error);
  }
  /**
   * @description Fired when couldn't reconnect within reconnectionAttempts.
   */
  onReconnectFailedHandler() {
    this.updateStatus(reconnect_failed);
  }
  /**
   * Fired when a ping packed is written out to the server
   */
  onPingHandler() {
    this.updateStatus(ping);
  }

  /**
   * @description Fired when a pong is received from the server.
   * @param {Number} latency number of ms elapsed since ping packet (i.e.: latency).
   */
  onPongHandler(latency:number) {
    this.updateStatus(pong, latency);
  }
  initialize() {
    log("Initializing Socket Scheduler");
    this.socket.on("connect", this.onConnectedHandler);

    this.socket.on(connect_timeout, this.onConnectTimeoutHandler);

    this.socket.on(reconnect, this.onReconnectHandler);

    this.socket.on(connect_error, this.onConnectErrorHandler);

    this.socket.on(reconnect_attempt, this.onReconnectionAttemptHandler);

    this.socket.on(reconnecting, this.onReconnectingHandler);

    this.socket.on(reconnect_error, this.onReconnectErrorHandler);

    this.socket.on(reconnect_failed, this.onReconnectFailedHandler);

    this.socket.on(ping, this.onPingHandler);

    this.socket.on(pong, this.onPongHandler);
  }

  render() {
    return (
      <IconButton color={this.state.connected ? "primary" : "secondary"}>
        <Wifi />
      </IconButton>
    );
  }
}
