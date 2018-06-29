import React, { Component } from "react";
import PaintList from "./PaintList";
import Login from "./Login";
import { AppContext, ConnectionContext } from "../context/AppContext";
import MagnaHeader from "./MagnaHeader";
import PropTypes from "prop-types";
import { Grid } from "react-bootstrap";
export default class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      connectionState: "disconnected",
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
    const getContent = () => {
      if (this.state.currentUser.id !== -1) {
        return (
          <PaintList
            connectionStateChanged={(connectionState) =>
              this.setState({ connectionState: connectionState })
            }
            role={this.state.role}
            OSName={this.props.OSName}
            environment={this.props.environment}
            currentUser={this.state.currentUser}
          />
        );
      }
      return (
        <Login
          os={this.props.OSName}
          setUser={(user, name, role) =>
            this.setState({ currentUser: { id: user, name }, role })
          }
        />
      );
    };
    return (
      <div>
        <AppContext.Provider value={this.state}>
          <MagnaHeader connectionState={this.state.connectionState} />
          <Grid>{getContent()}</Grid>
        </AppContext.Provider>
      </div>
    );
  }
}

Main.propTypes = {
  connectionState: PropTypes.any,
  environment: PropTypes.string.isRequired,
  OSName: PropTypes.string.isRequired
};
