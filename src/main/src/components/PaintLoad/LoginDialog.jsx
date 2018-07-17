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

export default class LoginDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.currentUser.id,

      type: 'assist'
    };
    this.updateId = this.updateId.bind(this);
    this.handleLoginAction = this.handleLoginAction.bind(this);
  }

  updateId(event) {
    const value = parseInt(event.target.value, 10);

    this.setState({ id: value });

    // e => this.setState({ user["id"]: e.target.value })
  }

  handleLoginAction() {
    const { handleLogin } = this.props;
    handleLogin(this.state);
  }

  render() {
    const { type, id } = this.state;
    const { open, handleLogin } = this.props;
    const showValue = () => id || '';
    return (
      <Dialog disableBackdropClick disableEscapeKeyDown maxWidth='xs' open={open}>
        <DialogTitle id='confirmation-dialog-title'>Login</DialogTitle>
        <DialogContent>
          <Grid container direction='column'>
            <TextField
              label='Employee ID'
              type='number'
              autoFocus
              value={showValue()}
              onChange={this.updateId}
            />
            <TextField
              label='Login Type'
              select
              value={type}
              onChange={e => this.setState({ type: e.target.value })}
            >
              <MenuItem value='assist'>Load Assist</MenuItem>
              <MenuItem value='stage'>Stage</MenuItem>
              <MenuItem value='load'>Load</MenuItem>
            </TextField>
            <Button
              onClick={this.handleLoginAction}
              disabled={this.state.id == undefined || this.state.id === -1}
            >
              Login
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}
LoginDialog.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.any,
    img: PropTypes.string
  }).isRequired,
  handleLogin: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
