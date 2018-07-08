import React, { Component } from "react";
import PaintList from "./PaintList";
import Login from "./Login";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Grid,
  MenuItem,
  TextField
} from "@material-ui/core";

class LoginDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      data: {
        user: null,
        type: "assist"
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

    this.state.hasError = e.target.value.length == 0;
  }
  render() {
    const { open } = this.props;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        open={open}>
        <DialogTitle id="confirmation-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your information</DialogContentText>
          <Grid container direction="column">
            <form>
              <TextField
                id="user"
                name="user"
                type="number"
                helperText={
                  this.state.hasError ? "Employee Id must be a number" : null
                }
                error={this.state.hasError}
                fullWidth
                label="Employee ID"
                autoFocus
                value={this.state.data.user}
                onChange={this.handleChange}
                required
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                required
                name="type"
                fullWidth
                label="Login Type"
                select
                value={this.state.data.type}
                onChange={this.handleChange}>
                <MenuItem value="assist">Load Assist</MenuItem>
                <MenuItem value="stage">Stage</MenuItem>
                <MenuItem value="load">Load</MenuItem>
              </TextField>
              <Button
                disabled={
                  this.state.hasError ||
                  this.state.data.user == null ||
                  this.state.data.user.length == 0
                }
                color="primary"
                onClick={() => this.props.loggedIn(this.state)}>
                Login
              </Button>
            </form>
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
      connectionState: "disconnected",
      disabled: false,
      currentUser: {
        id: -1,
        name: ""
      },
      role: ""
    };
    this.loggedIn = this.loggedIn.bind(this);
  }
  loggedIn(args) {
    this.setState({
      showDialog: false,
      currentUser: { id: args.data.user },
      role: args.data.type
    });
  }

  setUser(userId, name, role) {
    debugger;
    this.setState({ currentUser: { id: userId, name }, role });
  }
  render() {
    return (
      <Grid>
        <LoginDialog open={this.state.showDialog} loggedIn={this.loggedIn} />

        {this.state.role && (
          <PaintList
            connectionStateChanged={connectionState =>
              this.setState({ connectionState: connectionState })
            }
            role={this.state.role}
            OSName={this.props.OSName}
            environment={this.props.environment}
            currentUser={this.state.currentUser}
          />
        )}
      </Grid>
    );
  }
}

Main.propTypes = {
  connectionState: PropTypes.any,
  environment: PropTypes.string.isRequired,
  OSName: PropTypes.string.isRequired
};
