import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Undo } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, Input } from '@material-ui/core';
import classNames from 'classnames';
import HammerComponent from './HammerComponent';

const styles = theme => ({
  root: {},
  footer: {},
  hover: {},
  head: {},
  selected: {},
  purple: {
    backgroundColor: 'purple'
  },
  green: {
    backgroundColor: 'green'
  },
  yellow: {
    backgroundColor: 'yellow'
  },
  orange: {
    backgroundColor: 'orange'
  },
  blue: {
    backgroundColor: 'blue'
  }
});
const colors = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];

class UndoCell extends Component {
  getCell() {
    const {
 rowData, role, currentUser, SwipeActionHandler
} = this.props;

    const answer = (
      <div className={classNames('tap', 'undo')}>
        <Input disableUnderline value={rowData.ten} />
      </div>
    );

    const undo = (
      <Undo
        className={`undo rack-group-${styles[parseInt(rowData.round_pos, 10) % colors.length]}`}
      />
    );

    switch (role) {
      case 'load':
        return rowData.picked_by !== '##AVAILABLE##' && rowData.handled_by !== '##AVAILABLE##'
          ? undo
          : answer;

      case 'stage':
        return rowData[rowData.length - 2] !== '##AVAILABLE##' ? undo : answer;

      case 'assist':
        return rowData.picked_by === currentUser.name ? undo : answer;

      default:
        return <span />;
    }
  }

  render() {
    const { classes, SwipeActionHandler } = this.props;
    const cell = this.getCell();
    return (
      <HammerComponent
        className={classes.root}
        content={cell}
        SwipeActionHandler={SwipeActionHandler}
        {...this.props}
      />
    );
  }
}
UndoCell.propTypes = {
  classes: PropTypes.object.isRequired,
  role: PropTypes.string,
  rowData: PropTypes.any,
  currentUser: PropTypes.any,
  round_pos: PropTypes.any
};
export default withStyles(styles)(UndoCell);
