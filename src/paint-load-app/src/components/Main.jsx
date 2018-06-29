import React, { Component } from "react";
import PaintList from "./PaintList";
import Login from "./Login";
import { AppContext, ConnectionContext } from "../context/AppContext";
import MagnaHeader from "./MagnaHeader";
import PropTypes from "prop-types";
import { Grid } from "react-bootstrap";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
export default class Main extends Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false
  };

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
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };
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
          <AppBar position="static">
            <Toolbar>
              <MagnaHeader connectionState={this.state.connectionState} />
            </Toolbar>
          </AppBar>

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
