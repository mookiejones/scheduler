import React, { Component } from "react";
import MagnaHeader from "./MagnaHeader";
import DriverPeformance from "./DriverPerformance";

import { Grid } from "@material-ui/core";
export default class Main extends Component {
  render() {
    return (
      <Grid>
        <MagnaHeader />
        <DriverPeformance />
      </Grid>
    );
  }
}
