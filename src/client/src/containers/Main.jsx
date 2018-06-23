import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PaintScheduleEditorContainer from "./PaintScheduleEditorContainer";
import PaintScheduleEditorContainer2 from "./PaintScheduleEditorContainer2";
import StyleCodeContainer from "./StyleCodeContainer";
import ExcelImportContainer from "./ExcelImportContainer";
// import { SignIn } from './components/SignIn';
import PaintAppContainer from "./PaintAppContainer";
import LoginContainer from "./LoginContainer";
import DriverPerformanceContainer from "./DriverPerformanceContainer";

export default class Main extends Component {
  render() {
    return (
      <div className="main-content">
        <Router>
          <Switch>
            <Route
              path="/ScheduleEditor"
              component={PaintScheduleEditorContainer}
            />
            <Route
              path="/ScheduleEditor2"
              component={PaintScheduleEditorContainer2}
            />
            <Route path="/StyleCodes" component={StyleCodeContainer} />
            <Route path="/PaintApp" component={PaintAppContainer} />
            <Route path="/ExcelImport" component={ExcelImportContainer} />
            {/* <Route path="/sign-in" component={SignIn} /> */}
            <Route path="/Login" component={LoginContainer} />
            <Route
              path="/DriverPerformance"
              component={DriverPerformanceContainer}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
