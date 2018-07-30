import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

/**
 * @class ReactiveButton
 */
export default class ReactiveButton extends Component {
  isActive() {
    debugger;
    const numChanged = this.props;
    if (numChanged > 0) {
      return 'btn btn-primary';
    } else {
      return 'disabled btn btn-primary';
    }
  }
  render() {
    const { clickEvent, text, className } = this.props;
    return (
      <Button onClick={clickEvent} bsStyle={className}>
        {text}
      </Button>
    );
  }
}

ReactiveButton.propTypes = {
  numChanged: PropTypes.any,
  clickEvent: PropTypes.func,
  className: PropTypes.any,
  text: PropTypes.any
};
