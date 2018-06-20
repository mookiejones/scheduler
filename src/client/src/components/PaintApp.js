import React, { Component } from "react";
import PaintList from "./PaintList";
import { Login } from "./Login";


const getOsName = (name) => {
  if (/Win/i.test(name)) return "Windows";
  if (/Macin/i.test(name)) return "MacOS";
  if (/X11/i.test(name)) return "UNIX";
  if (/Linux/i.test(name)) return "Linux";
  return "Unknown OS";
}

export class PaintApp extends Component {
  constructor(props, context) {
    super(props, context);
    let env = window.location.href.includes && window.location.href.includes("localhost")
      ? "development"
      : "production";
    const OSName = getOsName(navigator);


    this.state = {
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
    this.setState({currentUser: {id: userId, name: name}, role: role})
  }
  render() {
    if(this.state.currentUser.id != -1) {
        return (<PaintList role={this.state.role} OSName={this.state.OSName} environment={this.state.environment} currentUser={this.state.currentUser}/>);
    }else{
      return(<Login setUser={this.setUser} />)
    }

  }
}
