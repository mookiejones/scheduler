import React, { Component } from "react";

import * as hammer from "hammerjs";
import * as classnames from "classnames";
import PropTypes from "prop-types";
import ChildComponent from "./ChildComponent";

export default class HammerRow extends ChildComponent {
  componentDidMount() {
    return;
    this.hammer = hammer(this.row);
    this.hammer.on("tap", ev => {
      if (ev.target.classList.contains("tap")) {
        this.props.TapActionHandler(this.props.rowId, ev.target);
      }
      if (
        ev.target.classList.contains("undo") ||
        ev.target.classList.contains("fa-undo")
      ) {
        this.props.UndoActionHandler(this.props.rowId);
      }
    });
    this.hammer.on("swipe", ev => {
      this.props.SwipeActionHandler(this.props.rowId);
    });
  }
  onSwipe(e) {
    debugger;
  }
  onTap(e) {
    debugger;
  }
  componentWillUnmount() {
    return;
    this.hammer.off("tap");
    this.hammer.off("swipe");
    this.hammer.destroy();
    this.hammer = null;
  }
  render() {
    const grabbedBy = this.props.rowData.picked_by;
    const handledBy = this.props.rowData.handled_by;
    const stagedBy = this.props.rowData.staged_by;

    let cs = {
      myRow:
        this.props.role === "assist" &&
        grabbedBy === this.props.currentUser.name,
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
          stagedBy === "##AVAILABLE##"),
    };

    const styles = classnames(cs);

    return (
      <div ref={row => (this.row = row)} className={styles}>
        {this.props.children}
      </div>
    );
  }
}

HammerRow.propTypes = {
  TapActionHandler: PropTypes.func,
  rowId: PropTypes.any,
  children: PropTypes.any,
};
