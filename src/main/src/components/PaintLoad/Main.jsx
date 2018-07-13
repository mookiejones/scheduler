import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  MenuItem,
  TextField
} from '@material-ui/core';
import PaintList from './PaintList';

class LoginDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      type: 'assist'
    };
  }

  render() {
    const { open } = this.props;
    return (
      <Dialog disableBackdropClick disableEscapeKeyDown maxWidth='xs' open={open}>
        <DialogTitle id='confirmation-dialog-title'>Login</DialogTitle>
        <DialogContent>
          <Grid container direction='column'>
            <TextField
              label='Employee ID'
              autoFocus
              value={this.state.user}
              onChange={e => this.setState({ user: e.target.value })}
            />
            <TextField
              label='Login Type'
              select
              value={this.state.type}
              onChange={e => this.setState({ type: e.target.value })}
            >
              <MenuItem value='assist'>Load Assist</MenuItem>
              <MenuItem value='stage'>Stage</MenuItem>
              <MenuItem value='load'>Load</MenuItem>
            </TextField>
            <Button onClick={() => this.props.loggedIn(this.state)}>Login</Button>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

export default class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDialog: true,
      connectionState: 'disconnected',
      disabled: false,
      currentUser: {
        id: -1,
        name: ''
      },
      role: ''
    };
    this.loggedIn = this.loggedIn.bind(this);
  }

  loggedIn(args) {
    this.setState({ showDialog: false });
  }

  setUser(userId, name, role) {
    debugger;
    this.setState({ currentUser: { id: userId, name }, role });
  }

  render() {
    const getContent = () => {
      if (this.state.currentUser.id !== -1) {
        return (
          <PaintList
            connectionStateChanged={connectionState => this.setState({ connectionState })}
            role={this.state.role}
            OSName={this.props.OSName}
            environment={this.props.environment}
            currentUser={this.state.currentUser}
          />
        );
      }
      return (
        <div>
          <LoginDialog
            open={this.state.showDialog && this.props.route == 2}
            loggedIn={this.loggedIn}
          />
        </div>
      );
    };
    return <div>{getContent()}</div>;
  }
}

Main.propTypes = {
  route: PropTypes.number,
  connectionState: PropTypes.any
};
