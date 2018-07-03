import React, { Component } from "react";
import { headers } from "./TableConfig";
import * as PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  FormLabel,
  TextField,
  DialogActions,
} from "@material-ui/core";
export default class EditableRow extends Component {
  constructor(props) {
    super(props);
    this.row = null;
    this.state = {
      close: false,
      row: {},
    };

    this.handleEntering = this.handleEntering.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleEntering() {
    // debugger;
  }
  handleChange(e, n) {
    debugger;
    this.row[e.target.id] = e.target.value;

    this.setState({ row: this.row });
  }

  render() {
    const shouldOpen = this.props.open && !this.state.close;
    this.row = this.props.row;
    return (
      <Dialog open={shouldOpen} onEntering={this.handleEntering}>
        <DialogTitle id="form-dialog-title">Edit Row</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <FormControl>
            <FormLabel component="legend">Edit Row</FormLabel>
            {this.props.row &&
              headers.map(header => (
                <TextField
                  id={header.value}
                  key={header.value}
                  disabled={header.type === "ReadOnly"}
                  label={header.title}
                  onChange={this.handleChange}
                  value={this.row[header.value]}
                />
              ))}}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onClosed(true, null)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => this.props.onClosed(false, this.row)} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditableRow.propTypes = {
  open: PropTypes.bool.isRequired,
  onClosed: PropTypes.func.isRequired,
  row: PropTypes.object,
};
