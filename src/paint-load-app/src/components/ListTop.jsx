import React, { Component } from "react";

const VERSION_NUMBER = "1.3";
export default class ListTop extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentRoundNumber: 0,
      currentRevision: 0
    };
  }
  getPaintLabel() {
    const result =
      this.props.role === "load"
        ? "Load"
        : this.props.role === "stage"
          ? "Staging"
          : "Pick";
    return `Paint ${result} List `;
  }
  getEnvironmentLabel() {
    return this.props.environment === "production"
      ? ""
      : `(${this.props.environment})`;
  }
  getCurrentRoundLabel() {
    debugger;
  }
  render() {
    const paintLabel = this.getPaintLabel();
    const environmentLabel = this.getEnvironmentLabel();
    return (
      <div>
        <div style={{ margin: "8px 12px 0px 0px", textAlign: "right" }}>
          version: {VERSION_NUMBER}
        </div>
        <div className="centerDiv">
          <h3 style={{ textDecoration: "underline" }}>{paintLabel}</h3>
          <h4>{environmentLabel}</h4>
        </div>
        <h1 style={{ marginLeft: "2.5%" }}>
          {"Current Round: "}
          <span id="roundDisplay" className="label label-default">
            {this.state.currentRoundNumber}
          </span>
        </h1>
        <h3 style={{ marginLeft: "5%" }}>
          {"Schedule Revision: "}
          <strong>
            <span id="revisionDisplay">{this.state.currentRevision}</span>
          </strong>
        </h3>
      </div>
    );
  }
}
