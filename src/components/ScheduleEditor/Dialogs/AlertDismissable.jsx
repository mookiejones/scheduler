import React, { Component } from "react";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
import PropTypes from "prop-types";

export default class AlertDismissable extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: true
    };
  }

  handleDismiss() {
    this.setState({ show: false });
  }
  handleClose() {}
  handleShow() {
    this.setState({ show: true });
  }
  render() {
    if (this.props.msg.show) {
      return (
        <Dialog onClose={this.handleClose} aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title">Oh snap! Theres an error</DialogTitle>
          <div>
            <p>
              Change this and that and try again. Duis mollis, est non commodo
              luctus, nisi erat porttitor ligula, eget lacinia odio sem nec
              elit. Cras mattis consectetur purus sit amet fermentum.
            </p>
            <p>
              <Button bsStyle="danger">Take this action</Button>
              <span> or </span>
              <Button onClick={this.handleDismiss}>Hide Alert</Button>
            </p>
          </div>
        </Dialog>
      );
    }

    return <div />;
  }
}
AlertDismissable.defaultProps = {
  msg: {
    title: "",
    text: "",
    show: false
  }
};

AlertDismissable.propTypes = {
  msg: PropTypes.any
};
