import React, { Component } from "react";
import { Alert, Button } from "react-bootstrap";
import PropTypes from "prop-types";

export default class AlertDismissable extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = {
      show: true
    };
  }

  handleDismiss() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  render() {
    if (this.props.msg.show) {
      return (
        <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
          <h4>Oh snap! You got an error!</h4>
          <p>
            Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat
            porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
            fermentum.
          </p>
          <p>
            <Button bsStyle="danger">Take this action</Button>
            <span> or </span>
            <Button onClick={this.handleDismiss}>Hide Alert</Button>
          </p>
        </Alert>
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
