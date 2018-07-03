import React, { Component } from "react";
import MagnaHeader from "./MagnaHeader";
import DriverPeformance from "./DriverPerformance";
import { Grid, Snackbar, SnackbarContent } from "@material-ui/core";
import Logger from "../Logger";
import amber from "@material-ui/core/colors/amber";

Logger.log("creating");

export default class Main extends Component {
  constructor(props) {
    super(props);

    Logger.log("starting");

    this.state = {
      connected: false,
      message: "Disconnected"
    };

    this.onConnectionChanged = this.onConnectionChanged.bind(this);
  }

  onConnectionChanged(name, args, status) {
    let message = "";
    switch (name) {
      case "reconnect":
      case "connect":
        message = "Connected";
        break;
      case "reconnect_error":

      case "pong":
      case "ping":
      case "connect_error":
        message = this.state.message;

        break;
      case "reconnect_attempt":
        message = `Disconnected, Attempt ${args} to reconnect`;

        break;
      case "reconnecting":
        message = `Reconnecting, Attempt ${args} to reconnect`;
        break;

      default:
        debugger;
        break;
    }
    let requiresUpdate = this.state.connected == false && status;
    this.setState({ message: message, connected: status });
  }
  render() {
    return (
      <Grid>
        <MagnaHeader
          isConnected={this.state.connected}
          onConnectionChanged={this.onConnectionChanged}
          showConnectionState={true}
        />

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={this.state.connected == false}
          ContentProps={{ "aria-describedby": "message-id" }}>
          <SnackbarContent
            style={{ backgroundColor: "red" }}
            aria-describedby="client-snackbar"
            message={<span id="client-snackbar">{this.state.message}</span>}
          />
        </Snackbar>
        <DriverPeformance isConnected={this.state.connected} />
      </Grid>
    );
  }
}
