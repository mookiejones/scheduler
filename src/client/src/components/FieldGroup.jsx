import React from "react";
import { FormGroup, ControlLabel, FormControl, HelpBlock } from "react-bootstrap";


const FieldGroup = ({ id, label, help, inputRef, ...props })=> {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} inputRef={inputRef}/>
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  };

  export { FieldGroup };
