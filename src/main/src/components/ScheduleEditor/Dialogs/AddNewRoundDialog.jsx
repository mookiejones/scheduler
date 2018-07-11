import React, { Component } from "react";

import * as PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
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
    const { open, onClose, msg, answer } = this.props;

    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="add-round-title">
        <DialogTitle id="add-round-title">Add New Round</DialogTitle>
        <DialogContent>{msg}</DialogContent>
        <DialogActions>
          <Button onClick={() => answer(true)}>Yes</Button>
          <Button onClick={() => answer(false)}>No</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddNewRoundDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  msg: PropTypes.any,
  answer: PropTypes.func
};

export default withStyles(styles)(AddNewRoundDialog);
