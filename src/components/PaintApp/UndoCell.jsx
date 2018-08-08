/**
 * UndoCell.
 *
 * DataGrid Cell to Render the ability to undo.
 *
 * @since 7-25-2018
 *
 * @class UndoCell
 */

// ReSharper disable InconsistentNaming
import React, { Component } from 'react';

import { AVAILABLE } from '../../shared';
import PropTypes from 'prop-types';

// ReSharper restore InconsistentNaming
import { RowPropType } from './PaintPropTypes';
import { UndoIcon } from '../Icons';
const styles = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];

// ReSharper disable once InconsistentNaming
export default class UndoCell extends Component {
  render() {
    const { role, rowData, currentUser } = this.props;
    const styleNum = parseInt(rowData.round_position, 10) % styles.length;
    const rackGroup = `rack-group-${styles[styleNum]}`;
    const cn = `undo ${rackGroup}}`;

    const fawe = <UndoIcon />;
    let el = (
      <td style={{ fontSize: '45px' }} className={cn}>
        {fawe}
      </td>
    );

    switch (role) {
      case 'load':
        if (
          rowData.staged_by !== AVAILABLE &&
          rowData.handled_by !== AVAILABLE
        ) {
          return el;
        } else {
          el = <td className={`tap ${cn}`}>{rowData.loc}</td>;
        }
        return el;

      case 'stage':
        if (rowData.staged_by !== AVAILABLE)
          return (
            <td
              style={{
                fontSize: '45px',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
              className={cn}>
              {fawe}
              <UndoIcon />
            </td>
          );
        return (
          <td
            className={`tap rack-group-${styles[styleNum]}`}
            style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            {rowData.loc}
          </td>
        );

      case 'assist':
        if (rowData.grab_by === currentUser.name)
          return <td className={cn}>{fawe}</td>;
        return (
          <td
            className={`tap ${rackGroup}`}
            style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            {rowData.loc}
          </td>
        );

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
  rowData: RowPropType
};
