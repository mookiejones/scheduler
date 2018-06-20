import React, { Component } from "react";
import * as Hammer from "react-hammerjs";

import * as classnames from "classnames";

export class HammerRow extends Component {
  componentDidMount() {
    this.hammer = Hammer(this.row);
    this.hammer.on("tap", (ev) => {
      if (ev.target.classList.contains("tap")) {
        this.props.TapActionHandler(this.props.rowId, ev.target);
      }
      if (ev.target.classList.contains("undo") || ev.target.classList.contains("fa-undo")) {
        this.props.UndoActionHandler(this.props.rowId);
      }
    });
    this.hammer.on("swipe", (ev) => {
      this.props.SwipeActionHandler(this.props.rowId);
    });
  }
  componentWillUnmount() {
    this.hammer.off("tap");
    this.hammer.off("swipe");
    this.hammer.destroy();
    this.hammer = null;
  }
  render() {
    const grabbedBy = this.props.rowData[this.props.rowData.length - 1];
    const handledBy = this.props.rowData[this.props.rowData.length - 2];
    const stagedBy = this.props.rowData[this.props.rowData.length - 3];

    const styles = classnames({
      myRow: this.props.role === "assist" && grabbedBy === this.props.currentUser.name,
      theirRow:
        this.props.role === "assist" &&
        grabbedBy !== "##AVAILABLE##" &&
        grabbedBy !== this.props.currentUser.name,
      ready:
        (this.props.role === "stage" && handledBy !== "##AVAILABLE##") ||
        (this.props.role === "load" && stagedBy !== "##AVAILABLE##"),
      intransit:
        (this.props.role === "stage" &&
          grabbedBy !== "##AVAILABLE##" &&
          handledBy === "##AVAILABLE##") ||
        (this.props.role === "load" &&
          handledBy !== "##AVAILABLE##" &&
          stagedBy === "##AVAILABLE##")
    });

    return (
      <tr className={styles} ref={row => (this.row = row)}>
        {this.props.children}
      </tr>
    );
  }
}
