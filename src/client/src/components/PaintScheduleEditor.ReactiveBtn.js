import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const ReactiveBtn = ({ numChanged, clickEvent, text }) => (
  <Button active={numChanged > 0} onClick={clickEvent} bsStyle="warning">
    {" "}
    {text}
  </Button>
);

ReactiveBtn.propTypes = {
  numChanged: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  clickEvent: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  text: PropTypes.string
};

export default ReactiveBtn;
