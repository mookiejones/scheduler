import React from "react";
import PropTypes from "prop-types";
import { Button, Tooltip } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import styles from "../../styles";

const { tooltip } = styles;
const ReactiveButton = ({ numChanged, clickEvent, text }) => (
  <Tooltip id="tooltip-add-row" title="Add New Row">
    <Button
      onClick={clickEvent}
      variant="extendedFab"
      color="primary"
      aria-label="Add New round">
      <Add />
      {text}
    </Button>
  </Tooltip>
);
ReactiveButton.propTypes = {
  numChanged: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  clickEvent: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  text: PropTypes.string
};

export default ReactiveButton;
