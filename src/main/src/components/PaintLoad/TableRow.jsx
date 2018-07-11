import React, { Component } from "react";
import * as PropTypes from "prop-types";
import * as hammer from "hammerjs";

export default class TableRow extends Component {
  constructor(props) {
    super(props);
    this.row = React.createRef();
  }

  componentDidMount() {
    this.hammer = hammer(this.row);
    this.hammer.on("tap", (ev) => {
      if (ev.target.classList.contains("tap")) {
        this.props.TapActionHandler(this.props.rowId, ev.target);
      }
      if (/(?:undo|fa-undo)/.test(ev.target.className)) {
        this.props.UndoActionHandler(this.props.rowId);
      }
    });
    this.hammer.on("swipe", (ev) => {
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
    this.hammer.off("tap");
    this.hammer.off("swipe");
    this.hammer.destroy();
    this.hammer = null;
  }
  render() {
    return <tr ref={(row) => (this.row = row)}>{this.props.children}</tr>;
  }
}
TableRow.propTypes = {
  TapActionHandler: PropTypes.func,
  UndoActionHandler: PropTypes.func,
  SwipeActionHandler: PropTypes.func,
  role: PropTypes.string,
  data: PropTypes.any
};
