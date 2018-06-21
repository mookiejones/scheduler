import React, { Component } from "react";
import Header from "./containers/Header";
import Main from "./containers/Main";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Header />

        <Main />
      </div>
    );
  }
}

export default App;
