import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import registerServiceWorker from "./registerServiceWorker";
import ScheduleEditorContainer from "./containers/ScheduleEditorContainer";

ReactDOM.render(<App />, document.getElementById("root"));

registerServiceWorker();
