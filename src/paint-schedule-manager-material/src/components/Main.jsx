import React, { Component } from "react";
import MagnaHeader from "magna-header";
import { Grid, Snackbar, SnackbarContent } from "@material-ui/core";

import PaintScheduleEditor2 from "./PaintScheduleEditor2";
export default class Main extends Component {
  constructor(props) {
    super(props);

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
      message = this.state.message;
      break;

      case "pong":
      message = this.state.message;
      break;
    case "ping":
      message = this.state.message;
      break;
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
    // let requiresUpdate = this.state.connected == false && status;
    this.setState({ message: message, connected: status });
  }

  render() {
    return (
      <Grid>
        <MagnaHeader
          isConnected={this.state.connected}
          onConnectionChanged={this.onConnectionChanged}
          showConnectionState={true} />

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
        <PaintScheduleEditor2 isConnected={this.state.connected} />
      </Grid>
    );
  }
}
