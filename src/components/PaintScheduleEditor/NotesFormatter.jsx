import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * @class NotesFormatter
 */

const NotesFormatter = ({ value }) => {
  const labelClass = classnames({
    redhot: value.toLowerCase().includes('red hot')
  });
  return <div className={labelClass}>{value}</div>;
};

NotesFormatter.propTypes = {
  value: PropTypes.any
};

export default NotesFormatter;
