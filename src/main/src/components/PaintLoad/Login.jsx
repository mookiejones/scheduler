import React, { Component } from "react";
import * as PropTypes from "prop-types";
import {
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  Paper,
  Button
} from "@material-ui/core";

import AccountCircle from "@material-ui/icons/AccountCircle";

import DataService from "../../api/DataService";
import { AppContext } from "./context/AppContext";

export default class Login extends Component {
  constructor(props, context) {
    super(props, context);

    try {
      //this.input = React.createRef();
      //this.selectRole = React.createRef();
      // this.loginUser = this.loginUser.bind(this);
      this.focusTextInput = this.focusTextInput.bind(this);
    } catch (e) {
      console.error(e);
    }
    this.input = React.createRef();
    this.state = {
      options: [
        { title: "assist", value: "Load Assist" },
        { title: "stage", value: "Stage" },
        { title: "load", value: "Load" }
      ],
      userId: -1,
      disabled: false,
      role: "assist"
    };
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.input.current.focus();
  }
  onLoggedIn(data) {
    debugger;

    //    this.input.blur();
    //    this.setState({ disabled: false });
    // this.props.setUser(userId, data, role);
  }
  loginUser(e) {
    e.preventDefault();
    const userId = this.input.value;

    const role = this.selectRole.value;

    this.setState({ userId: userId, role: role });

    //    this.props.setUser(userId, "cberman", role);

    let task = DataService.LoginUser(userId);

    task.then(({ d }) => this.props.setUser(userId, d, role)).catch((error) => {
      debugger;
    });
  }
  render() {
    const inputRef = (el) => (this.input = el);
    const roleRef = (el) => (this.selectRole = el);
    return (
      <AppContext.Provider value={{ role: this.state.role }}>
        <Paper>
          <Grid container>
            <form action="" className="form-signin">
              <h2 className="form-signin-heading">Please sign in</h2>
              <TextField
                label="Employee ID"
                margin="normal"
                required
                placeholder="Enter ID"
                autoFocus
                disabled={this.state.disabled}
                inputRef={inputRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  )
                }}
              />

              <Select id="select-login" value={this.state.role} displayEmpty>
                {this.state.options.map((option) => (
                  <MenuItem value={option.title}>{option.value}</MenuItem>
                ))}
              </Select>
              <Button
                onClick={(e) => this.loginUser(e)}
                bsStyle="primary"
                block
                type="submit">
                Sign in
              </Button>
            </form>
          </Grid>
        </Paper>
      </AppContext.Provider>
    );
  }
}
Login.defaultProps = {
  setUser: PropTypes.func
};
