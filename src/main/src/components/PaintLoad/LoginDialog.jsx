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
      user: -1,
      type: 'assist'
    };
  }

  render() {
    const { user, type } = this.state;
    const { open, loggedIn } = this.props;
    return (
      <Dialog disableBackdropClick disableEscapeKeyDown maxWidth='xs' open={open}>
        <DialogTitle id='confirmation-dialog-title'>Login</DialogTitle>
        <DialogContent>
          <Grid container direction='column'>
            <TextField
              label='Employee ID'
              type='number'
              autoFocus
              defaultValue={-1}
              value={user}
              onChange={e => this.setState({ user: e.target.value })}
            />
            <TextField
              label='Login Type'
              secelt
              value={type}
              onChange={e => this.setState({ type: e.target.value })}
            >
              <MenuItem value='assist'>Load Assist</MenuItem>
              <MenuItem value='stage'>Stage</MenuItem>
              <MenuItem value='load'>Load</MenuItem>
            </TextField>
            <Button onClick={() => loggedIn(this.state)} disabled={user === -1}>
              Login
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}
LoginDialog.propTypes = {
  loggedIn: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
