import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PaintScheduleEditor } from "./components/PaintScheduleEditor";
import { StyleCodeEditor } from "./components/StyleCodeEditor";
import { ExcelImport } from "./components/ExcelImport";
// import { SignIn } from './components/SignIn';
import { PaintApp } from "./components/PaintApp";
import { Login } from "./components/Login";
import { DriverPerformance } from "./components/DriverPerformance";

class RenderRoute extends Component {
  constructor(props, context) {
    super(props, context);
    console.log("hello there");
  }
  onRender(props) {

  }
  render() {
    return <Route path="/edit" render={this.onRender} />;
  }
}

export class Main extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" />
          <RenderRoute path="/edit" component={PaintScheduleEditor} />
          {/* <Route path="/edit" component={PaintScheduleEditor} /> */}
          <Route path="/style-codes" component={StyleCodeEditor} />
          <Route path="/paint-app" component={PaintApp} />
          <Route path="/excel-import" component={ExcelImport} />
          {/* <Route path="/sign-in" component={SignIn} /> */}
          <Route path="/login" component={Login} />
          <Route path="/drivers" component={DriverPerformance} />
        </Switch>
      </Router>
    );
  }
}
