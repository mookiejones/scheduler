import React from "react";

import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
} from "react-bootstrap";

const FieldGroup = props => {
  return (
    <FormGroup controlId={props.id}>
      <ControlLabel>{props.label}</ControlLabel>
      <FormControl {...props} inputRef={props.inputRef} />
      {props.help && <HelpBlock>{props.help}</HelpBlock>}
    </FormGroup>
  );
};

export default FieldGroup;
