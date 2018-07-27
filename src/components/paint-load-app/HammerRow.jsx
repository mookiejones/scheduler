import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AVAILABLE, ASSIST, STAGE, LOAD } from './Constants';
import Hammer from 'hammerjs';
export default class HammerRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { rowData } = this.props;
    const keys = Object.keys(nextProps.rowData);
    const result = keys.some((key) => rowData[key] !== nextProps.rowData[key]);
    return result;
  }

  componentDidMount() {
    const {
      TapActionHandler,
      UndoActionHandler,
      SwipeActionHandler,
      rowId
    } = this.props;

    this.hammer = Hammer(this.row);
    this.hammer
      .on('tap', (ev) => {
        const list = ev.target.classList;
        if (/tap/.test(list)) TapActionHandler(rowId, ev.target);

        if (/undo/.test(list)) UndoActionHandler(rowId);
      })
      .on('swipe', (ev) => {
        SwipeActionHandler(rowId);
      });
  }
  componentWillUnmount() {
    this.hammer.off('tap');
    this.hammer.off('swipe');
    this.hammer.destroy();
    this.hammer = null;
  }
  render() {
    const { rowData, role, currentUser } = this.props;
    var grabbedBy = rowData.grab_by;
    var handledBy = rowData.handled_by;
    var stagedBy = rowData.staged_by;

    var styles = classnames({
      myRow: role === ASSIST && stagedBy === currentUser.name,
      theirRow:
        role === ASSIST &&
        grabbedBy !== AVAILABLE &&
        grabbedBy !== currentUser.name,
      ready:
        (role === STAGE && handledBy !== AVAILABLE) ||
        (role === LOAD && stagedBy !== AVAILABLE),
      intransit:
        (role === STAGE &&
          grabbedBy !== AVAILABLE &&
          handledBy === AVAILABLE) ||
        (role === LOAD && handledBy !== AVAILABLE && stagedBy === AVAILABLE)
    });

    return (
      <tr className={styles} ref={(row) => (this.row = row)}>
        {this.props.children}
      </tr>
    );
  }
}

HammerRow.propTypes = {
  rowId: PropTypes.any,
  rowData: PropTypes.shape({
    id: PropTypes.number,
    color: PropTypes.string,
    date_grabbed: PropTypes.any,
    date_staged: PropTypes.any,
    date_handled: PropTypes.any,
    grab_by: PropTypes.string,
    handled_by: PropTypes.string,
    loc: PropTypes.any,
    master_id: PropTypes.number,
    mold_skin_style: PropTypes.string,
    notes: PropTypes.string,
    program: PropTypes.string,
    quantity: PropTypes.string,
    rework_color_chart: PropTypes.string,
    round: PropTypes.number,
    round_position: PropTypes.number,
    staged_by: PropTypes.string
  }),
  role: PropTypes.string,
  currentUser: PropTypes.object,
  SwipeActionHandler: PropTypes.func.isRequired,
  TapActionHandler: PropTypes.func.isRequired,
  UndoActionHandler: PropTypes.func.isRequired,
  children: PropTypes.any
};
