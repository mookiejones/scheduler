import React, { Component } from "react";

import * as PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({});
class AddNewRoundDialog extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(result) {
    this.props.answer(result);
  }
  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="add-round-title">
        <DialogTitle id="add-round-title">Add New Round</DialogTitle>
        <DialogContent>{this.props.msg}</DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose(true)}>Yes</Button>
          <Button onClick={() => this.handleClose(false)}>No</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddNewRoundDialog);
