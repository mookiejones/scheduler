import React, { Component } from 'react';
import { Grid, Snackbar, SnackbarContent } from '@material-ui/core';
import MagnaHeader from './MagnaHeader';

import PaintScheduleEditor from './PaintScheduleEditor';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      message: 'Disconnected',
      showSettings: false
    };
    this.onConnectionChanged = this.onConnectionChanged.bind(this);
  }

  onConnectionChanged(name, args, status) {
    let message = '';
    switch (name) {
      case 'reconnect':
      case 'connect':
        message = 'Connected';
        break;
      case 'reconnect_error':
        message = this.state.message;
        break;

      case 'pong':
        message = this.state.message;
        break;
      case 'ping':
        message = this.state.message;
        break;
      case 'connect_error':
        message = this.state.message;
        break;
      case 'reconnect_attempt':
        message = `Disconnected, Attempt ${args} to reconnect`;

        break;
      case 'reconnecting':
        message = `Reconnecting, Attempt ${args} to reconnect`;
        break;
      case 'connect_timeout':
        message = `Connection Timeout ${args}`;
        break;

      default:
        debugger;
        break;
    }
    // let requiresUpdate = this.state.connected == false && status;
    this.setState({ message, connected: status });
  }

  render() {
    const { environment } = this.props;
    return (
      <Grid>
        <MagnaHeader
          environment={environment}
          isConnected={this.state.connected}
          onConnectionChanged={this.onConnectionChanged}
          showConnectionState
          showSettings={() => this.setState({ showSettings: !this.state.showSettings })}
        />

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.connected === false}
          ContentProps={{ 'aria-describedby': 'message-id' }}
        >
          <SnackbarContent
            style={{ backgroundColor: 'red' }}
            aria-describedby='client-snackbar'
            message={<span id='client-snackbar'>{this.state.message}</span>}
          />
        </Snackbar>
        <PaintScheduleEditor
          isConnected={this.state.connected}
          showSettings={this.state.showSettings}
        />
      </Grid>
    );
  }
}
