import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';

const ReactiveButton = ({ clickEvent, text, disabled }) => {
  if (disabled) return <div />;
  return (
    <Tooltip
      id='tooltip-add-row'
      title='Add New Row'
      disableFocusListener={disabled}
      disableHoverListener={disabled}
      disableTouchListener={disabled}
    >
      <Button
        disabled={disabled}
        onClick={clickEvent}
        variant='extendedFab'
        color='primary'
        aria-label='Add New round'
      >
        <Add />
        {text}
      </Button>
    </Tooltip>
  );
};

ReactiveButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  numChanged: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  clickEvent: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  text: PropTypes.string
};

export default ReactiveButton;
