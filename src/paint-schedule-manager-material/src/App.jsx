import React, { Component } from "react";

// // import './css/font-awesome.min.css';

import { Grid } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Main from "./components/Main";

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const App = () => (
  <React.Fragment>
    <MuiThemeProvider theme={theme}>
      <Grid>
        <Main />
      </Grid>
    </MuiThemeProvider>
  </React.Fragment>
);

export default App;
