import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Label } from 'react-bootstrap';
export default class Description extends Component {
  render() {
    const { rowData, children } = this.props;
    const row = rowData.program;
    const style = classnames({
      tap: true,
      label: true,
      'label-danger': /(?:Do Not Ship|Red Hot !!)$/.test(row),
      'label-info': row === 'Ship If Good',
      'label-warning': row === 'Build'
    });

    let bsStyle = 'default';
    switch (row) {
      case 'Ship If Good':
        bsStyle = 'info';
        break;
      case 'Build':
        bsStyle = 'warning';
        break;
      default:
        if (/(?:Do Not Ship|Red Hot !!)$/.test(row)) bsStyle = 'danger';
        break;
    }

    return (
      <td className="tap">
        <p>
          {children}
          {bsStyle !== 'default' && <Label bsStyle={bsStyle}>{row}</Label>}
        </p>
      </td>
    );
  }
}
Description.propTypes = {
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
  children: PropTypes.any
};
