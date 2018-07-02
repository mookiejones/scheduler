import React, { Component } from "react";
import * as PropTypes from "prop-types";

import { DataService } from "../api";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import FieldGroup from "./FieldGroup";
import { AppContext } from "../context/AppContext";
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
      userId: -1,
      disabled: false,
      role: ""
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
        <div
          className="login-wrapper"
          style={{ width: "250px", margin: "auto" }}>
          <form action="" className="form-signin">
            <h2 className="form-signin-heading">Please sign in</h2>

            <FieldGroup
              type="text"
              placeholder="Employee ID"
              id="inputId"
              pattern="[0-9]*"
              disabled={this.state.disabled}
              inputRef={inputRef}
            />
            <FormGroup>
              <FormControl
                componentClass="select"
                disabled={this.state.disabled}
                inputRef={roleRef}
                id="selectRole">
                <option value="assist">Load Assist</option>
                <option value="stage">Staging</option>
                <option value="load">Load</option>
              </FormControl>
            </FormGroup>
            <Button
              onClick={(e) => this.loginUser(e)}
              bsStyle="primary"
              block
              type="submit">
              Sign in
            </Button>
          </form>
        </div>
      </AppContext.Provider>
    );
  }
}
Login.defaultProps = {
  setUser: PropTypes.func
};
