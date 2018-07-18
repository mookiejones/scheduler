import React, { Component } from 'react';
import ReactHammer from 'react-hammerjs';
import { TableCell, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

export default class HammerComponent extends Component {
  constructor(props) {
    super(props);
    this.onTap = this.onTap.bind(this);
    this.onSwipe = this.onSwipe.bind(this);
  }

  onTap(event) {
    const { classList } = event.target;
    const { TapActionHandler, UndoActionHandler, rowData } = this.props;

    if (classList.contains('tap')) {
      TapActionHandler(event.target, rowData);
    }
    if (classList.contains('undo')) {
      UndoActionHandler(event.target, rowData);
    }
  }

  onSwipe(event) {
    const { rowData, SwipeActionHandler } = this.props;
    SwipeActionHandler(rowData.id);
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    const { children, content } = this.props;
    const data = content != null ? content : children;
    return (
      <TableCell padding='dense'>
        <ReactHammer onTap={this.onTap} onSwipe={this.onSwipe}>
          <div>{data}</div>
        </ReactHammer>
      </TableCell>
    );
  }
}

HammerComponent.propTypes = {
  rowData: PropTypes.object,
  content: PropTypes.any,
  SwipeActionHandler: PropTypes.func.isRequired,
  UndoActionHandler: PropTypes.func.isRequired,
  TapActionHandler: PropTypes.func.isRequired
};

HammerComponent.defaultProps = {
  content: null
};
