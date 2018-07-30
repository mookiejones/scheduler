/**
 * UndoCell.
 *
 * DataGrid Cell to Render the ability to undo.
 *
 * @since 7-25-2018
 *
 * @class UndoCell
 */

import React, { Component } from 'react';
import { AVAILABLE } from '../../shared/Constants';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
const styles = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];

export default class UndoCell extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { rowData } = this.props;
    const keys = Object.keys(nextProps.rowData);
    const result = keys.some((key) => rowData[key] !== nextProps.rowData[key]);
    return result;
  }
  render() {
    const { role, rowData, currentUser } = this.props;
    const styleNum = parseInt(rowData.round_position, 10) % styles.length;
    const cn = `undo rack-group-${styles[styleNum]}`;
    switch (role) {
      case 'load':
        if (rowData.staged_by !== AVAILABLE && rowData.handled_by !== AVAILABLE)
          return (
            <td style={{ fontSize: '45px' }} className={cn}>
              <FontAwesome name="undo" size="xs" />
            </td>
          );
        return <td className={'tap ' + cn}>{rowData.loc}</td>;

      case 'stage':
        if (rowData.staged_by !== AVAILABLE)
          return (
            <td style={{ fontSize: '45px' }} className={cn}>
              <FontAwesome name="undo" />
              <FontAwesome name="undo" size="xs" />
            </td>
          );
        return (
          <td className={'tap rack-group-' + styles[styleNum]}>
            {rowData.loc}
          </td>
        );

      case 'assist':
        if (rowData.staged_by === currentUser.name)
          return (
            <td className={cn}>
              <FontAwesome name="undo" size="2x" />
            </td>
          );
        return <td className={'tap ' + cn}>{rowData.loc}</td>;

      default:
        return <td />;
    }
  }
}

UndoCell.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    img: PropTypes.string,
    imgPath: PropTypes.string,
    name: PropTypes.string
  }),
  role: PropTypes.string,
  rowData: PropTypes.any
};
