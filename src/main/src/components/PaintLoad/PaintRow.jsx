import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';
import { TableRow } from '@material-ui/core';

export default class PaintRow extends Component {
  constructor(props) {
    super(props);
    this.row = React.createRef();
    this.handleTap = this.handleTap.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  handleTap(event) {
    debugger;
  }

  handleSwipe(event) {
    debugger;
  }

  componentDidMount() {
    /*
    this.hammer = hammer(this.row);
    this.hammer.on('tap', (ev) => {
      if (ev.target.classList.contains('tap')) {
        this.props.TapActionHandler(this.props.rowId, ev.target);
      }
      if (/(?:undo|fa-undo)/.test(ev.target.className)) {
        this.props.UndoActionHandler(this.props.rowId);
      }
    });
    this.hammer.on('swipe', (ev) => {
      this.props.SwipeActionHandler(this.props.rowId);
    }); */
  }

  onSwipe(e) {
    debugger;
  }

  onTap(e) {
    debugger;
  }

  render() {
    return (
      <TableRow hover>
        <Hammer onTap={this.handleTap} onSwipe={this.handleSwipe}>
          <div>{this.props.children}</div>
        </Hammer>
      </TableRow>
    );
  }
}
PaintRow.propTypes = {
  TapActionHandler: PropTypes.func,
  UndoActionHandler: PropTypes.func,
  SwipeActionHandler: PropTypes.func,
  role: PropTypes.string,
  data: PropTypes.any
};
