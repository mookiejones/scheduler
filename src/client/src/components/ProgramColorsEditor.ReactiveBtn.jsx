import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

const ReactiveBtn = ({
 style, clickEvent, className, text
}) => (
  <Button style={style} onClick={clickEvent} className={className}>
    {text}
  </Button>
);

ReactiveBtn.propTypes = {
  style: PropTypes.string,
  className: PropTypes.string, // eslint-disable-line react/forbid-prop-types
  clickEvent: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  onRowClick: PropTypes.func,
  programColors: PropTypes.any,
  selectedIndexes: PropTypes.any,
  text: PropTypes.string
};
export default ReactiveBtn;
