import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
export default class Description extends Component {
  render() {
    const { rowData, children } = this.props;
    const { program, notes } = rowData;
    const style = classnames({
      tap: true,
      label: true,
      'label-danger': /(?:Do Not Ship|Red Hot !!)$/.test(notes),
      'label-info': /Ship If Good/i.test(notes),
      'label-warning': /build/i.test(notes)
    });

    return (
      <td className="tap">
        {children}
        {notes && notes.length > 0 && <br />}
        {notes &&
          notes.length > 0 && (
            <div
              className="tap"
              style={{ marginBottom: '10px', marginTop: '10px' }}>
              <span className={style}>{notes}</span>
            </div>
          )}
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
