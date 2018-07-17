import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Undo } from '@material-ui/icons';

const styles = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];

export default class UndoCell extends Component {
  render() {
    const { rowData, role, currentUser } = this.props;

    const answer = (
      <div
        className={`tap undo rack-group-${styles[parseInt(rowData.round_pos, 10) % styles.length]}`}
      >
        {rowData.ten}
      </div>
    );

    const undo = (
      <Undo
        className={`undo rack-group-${styles[parseInt(rowData.round_pos, 10) % styles.length]}`}
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
}
UndoCell.propTypes = {
  role: PropTypes.string,
  rowData: PropTypes.any,
  currentUser: PropTypes.any,
  round_pos: PropTypes.any
};
