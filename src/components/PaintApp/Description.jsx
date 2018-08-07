import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default class Description extends Component {
  render() {
    const { rowData, children } = this.props;
    const row = rowData.program;

    if (row !== '') {
      const style = classnames({
        tap: true,
        label: true,
        'label-danger': row === 'Do Not Ship' || row === 'Red Hot !!',
        'label-info': row === 'Ship If Good',
        'label-warning': row === 'Build'
      });

      return (
        <td className="tap">
          {children}
          <br />
          <div
            className="tap"
            style={{ marginBottom: '10px', marginTop: '10px' }}>
            <span className={style}>{row}</span>
          </div>
        </td>
      );
    } else {
      return <td className="tap">{children}</td>;
    }
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
