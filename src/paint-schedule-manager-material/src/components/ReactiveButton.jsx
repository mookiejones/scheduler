import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";

const ReactiveButton = ({ numChanged, clickEvent, text }) => (
    <Button onClick={clickEvent} variant="fab" color="primary" aria-label="add">
      <Add />
      {text}
    </Button>
  );
  ReactiveButton.propTypes = {
    numChanged: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    clickEvent: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    text: PropTypes.string
  };

  export default ReactiveButton;