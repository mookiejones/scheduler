import React, { Component } from "react";
import Main from "./components/Main";
import "./App.css";
import "./css/bootstrap.css";
import "./css/default.css";
// // import './css/font-awesome.min.css';
import "./css/navigation.css";
import "./css/react-bootstrap-table-all.min.css";
import "./css/react-context-menu.css";
import "./css/react-data-grid.css";
import "./css/style.css";
import { AppContext } from "./context/AppContext";

class App extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {(app) => <Main environment={app.environment} OSName={app.OSName} />}
      </AppContext.Consumer>
    );
  }
}

export default App;
