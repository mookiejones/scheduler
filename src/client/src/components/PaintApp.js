import React, { Component } from "react";
import PaintList from "./PaintList";
import { Login } from "./Login";

export class PaintApp extends Component {
  state = {
    disabled: false,
    environment: "development",
    currentUser: {
      id: -1,
      name: ""
    },
    role: "",
    OSName: "Windows"
  };
  getInitialState() {
    var env = "production";
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") !== -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") !== -1) OSName = "Linux";

    if (window.location.href.includes && window.location.href.includes("localhost")) {
      env = "development";
    }
    return {
      environment: env,
      currentUser: {
        id: -1,
        name: ""
      },
      role: "",
      OSName: OSName
    };
  }
  setUser(userId, name, role) {
    this.setState({ currentUser: { id: userId, name: name }, role: role });
  }
  render() {
    if (this.state.currentUser.id !== -1) {
      return (
        <PaintList
          role={this.state.role}
          OSName={this.state.OSName}
          environment={this.state.environment}
          currentUser={this.state.currentUser}
        />
      );
    } else {
      return <Login setUser={this.setUser} />;
    }
  }
}
