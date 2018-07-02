import React from "react";
import Main from "./components/Main";
import { Grid } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
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
