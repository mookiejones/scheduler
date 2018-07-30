import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

export default class AlertComponent extends Component {
  render() {
    const { content, type } = this.props;

    let style = type || 'danger';
    let show = content.length > 0;
    if (!show) return '';
    return <Alert bsStyle={style}>{content}</Alert>;
  }
}

AlertComponent.propTypes = {
  content: PropTypes.any.isRequired,
  type: PropTypes.string
};
