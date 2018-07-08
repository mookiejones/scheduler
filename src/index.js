import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./components/PaintLoad/Main"
import App from "./App.jsx";
import {
    createStore
} from "redux";


// import SettingsComponent from "./components/ScheduleEditor/Settings/SettingsComponent"
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render( < App / > , document.getElementById("root"));
registerServiceWorker();