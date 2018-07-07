import React, { Component } from "react";
import PropTypes from "prop-types";
export default class ChildComponent extends Component {
  constructor(props, context) {
    super(props, context);
    if (props.children) {
    }
  }

  render() {
    return super.render();
  }
}

ChildComponent.propTypes = {
  children: PropTypes.any,

  currentUser: PropTypes.any,
};
