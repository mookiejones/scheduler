import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PaintScheduleEditor } from "./components/PaintScheduleEditor";
import { StyleCodeEditor } from "./components/StyleCodeEditor";
import { ExcelImport } from "./components/ExcelImport";
// import { SignIn } from './components/SignIn';
import { PaintApp } from "./components/PaintApp";
import { Login } from "./components/Login";
import { DriverPerformance } from "./components/DriverPerformance";

export class Main extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/ScheduleEditor" component={PaintScheduleEditor} />
          <Route path="/style-codes" component={StyleCodeEditor} />
          <Route path="/paint-app" component={PaintApp} />
          <Route path="/ExcelImport" component={ExcelImport} />
          {/* <Route path="/sign-in" component={SignIn} /> */}
          <Route path="/login" component={Login} />
          <Route path="/DriverPerformance" component={DriverPerformance} />
        </Switch>
      </Router>
    );
  }
}
