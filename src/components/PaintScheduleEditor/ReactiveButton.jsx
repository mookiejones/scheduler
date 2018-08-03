import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

/**
 * @class ReactiveButton
 */

const ReactiveButton = ({ clickEvent, text, className }) => (
  <Button onClick={clickEvent} bsStyle={className}>
    {text}
  </Button>
);

ReactiveButton.propTypes = {
  numChanged: PropTypes.any,
  clickEvent: PropTypes.func,
  className: PropTypes.any,
  text: PropTypes.any
};

export default ReactiveButton;
