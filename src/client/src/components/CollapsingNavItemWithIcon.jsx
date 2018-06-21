import React, { Component } from "react";
import { Collapse, NavItem } from "react-bootstrap";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";

export default class CollapsingNavItemWithIcon extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { hover: false };
  }
  render() {
    return (
      <NavItem
        href={this.props.href}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <Collapse in={this.state.hover}>
          <span>{this.props.text}</span>
        </Collapse>
        <FontAwesome name={this.props.icon} />
      </NavItem>
    );
  }
}
CollapsingNavItemWithIcon.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};
