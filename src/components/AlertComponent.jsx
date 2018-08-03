import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

const AlertComponent = ({ content, type }) => {
  const style = type || 'danger';
  const show = content.length > 0;
  if (!show) return '';
  return <Alert bsStyle={style}>{content}</Alert>;
};

AlertComponent.propTypes = {
  content: PropTypes.any.isRequired,
  type: PropTypes.string
};

export default AlertComponent;
