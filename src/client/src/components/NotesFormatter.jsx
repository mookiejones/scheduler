import * as classnames from "classnames";
import React, { Component } from "react";

class NotesFormatter extends Component {
  render() {
    const labelClass = classnames({
      redhot: this.props.value.toLowerCase().includes("red hot")
    });
    return <div className={labelClass}>{this.props.value}</div>;
  }
}

export { NotesFormatter };
