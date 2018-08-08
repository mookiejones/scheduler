import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AVAILABLE, ASSIST, STAGE, LOAD } from '../../shared';
// import Hammer from 'hammerjs';
import { RowPropType } from './PaintPropTypes';
import Hammer from 'react-hammerjs';
const hammer = require('debug')('HammerRow');

const hammerOptions = {
  touchAction: 'compute',
  recognizers: {
    tap: {
      time: 600,
      threshold: 100
    },
    swipe: {
      direction: 'DIRECTION_LEFT' | 'DIRECTION_RIGHT'
    }
  }
};

/**
 * @class HammerRow
 */
export default class HammerRow extends Component {
  constructor(props) {
    super(props);
    this.handleTap = this.handleTap.bind(this);
  }

  handleTap(event) {
    event.preventDefault();
    const { TapActionHandler, UndoActionHandler, rowId, rowData } = this.props;
    hammer('handleTap');
    const list = event.target.classList;
    if (/tap/.test(list)) {
      TapActionHandler(rowId, event.target);
    }

    if (/undo/.test(list)) {
      UndoActionHandler(rowId, rowData);
    }
  }

  /**
   * Render
   */
  render() {
    const { rowData, role, currentUser, SwipeActionHandler } = this.props;

    const { grab_by, handled_by, staged_by } = rowData;

    if (role === ASSIST && staged_by !== AVAILABLE) {
      debugger;
    }

    if (role === ASSIST && grab_by !== AVAILABLE) {
      // debugger;
    }
    const styles = classnames({
      myRow: role === ASSIST && grab_by === currentUser.name,
      theirRow:
        role === ASSIST &&
        grab_by !== AVAILABLE &&
        grab_by !== currentUser.name,
      ready:
        (role === STAGE && handled_by !== AVAILABLE) ||
        (role === LOAD && staged_by !== AVAILABLE),
      intransit:
        (role === STAGE && grab_by !== AVAILABLE && handled_by === AVAILABLE) ||
        (role === LOAD && handled_by !== AVAILABLE && staged_by === AVAILABLE)
    });

    return (
      <Hammer
        onTap={this.handleTap}
        options={hammerOptions}
        onSwipe={SwipeActionHandler}>
        <tr className={styles}>{this.props.children}</tr>
      </Hammer>
    );
  }
}

HammerRow.propTypes = {
  rowId: PropTypes.any,
  rowData: RowPropType,
  role: PropTypes.string,
  currentUser: PropTypes.object,
  SwipeActionHandler: PropTypes.func.isRequired,
  TapActionHandler: PropTypes.func.isRequired,
  UndoActionHandler: PropTypes.func.isRequired,
  children: PropTypes.any
};
