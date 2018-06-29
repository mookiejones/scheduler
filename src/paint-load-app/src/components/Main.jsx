import React, { Component } from "react";
import PaintList from "./PaintList";
import Login from "./Login";
import { AppContext } from "../context/AppContext";
import PropTypes from "prop-types";
export default class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      disabled: false,
      currentUser: {
        id: -1,
        name: ""
      },
      role: ""
    };
  }

  setUser(userId, name, role) {
    debugger;
    this.setState({ currentUser: { id: userId, name }, role });
  }
  render() {
    if (this.state.currentUser.id !== -1) {
      return (
        <PaintList
          role={this.state.role}
          OSName={this.props.OSName}
          environment={this.props.environment}
          currentUser={this.state.currentUser}
        />
      );
    }
    return (
      <AppContext.Provider value={this.state}>
        <Login
          setUser={(user, name, role) =>
            this.setState({ currentUser: { id: user, name }, role })
          }
        />
      </AppContext.Provider>
    );
  }
}

Main.propTypes = {
  environment: PropTypes.string.isRequired,
  OSName: PropTypes.string.isRequired
};
