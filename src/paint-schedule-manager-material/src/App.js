import React, {
  Component
} from "react";
import "./App.css";
import "./css/bootstrap.css";
import "./css/default.css";
// // import './css/font-awesome.min.css';
import "./css/navigation.css";
import "./css/react-bootstrap-table-all.min.css";
import "./css/react-context-menu.css";
import "./css/react-data-grid.css";
import "./css/style.css";

import {
  Grid
} from "@material-ui/core";
import {
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Main from "./components/Main";


const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

const App = () => ( <
  React.Fragment >
  <
  MuiThemeProvider theme = {
    theme
  } >
  <
  Grid >
  <
  Main / >
  <
  /Grid> < /
  MuiThemeProvider > <
  /React.Fragment>
);

export default App;