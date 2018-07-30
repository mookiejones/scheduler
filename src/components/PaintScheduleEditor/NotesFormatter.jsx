import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * @class NotesFormatter
 */
export default class NotesFormatter extends Component {
  render() {
    const { value } = this.props;
    const labelClass = classnames({
      redhot: value.toLowerCase().includes('red hot')
    });
    return <div className={labelClass}>{value}</div>;
  }
}
NotesFormatter.propTypes = {
  value: PropTypes.any
};
