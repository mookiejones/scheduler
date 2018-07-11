import React, { Component } from "react";
import * as classnames from "classnames";

import { AVAILABLE } from "../../Constants";
import PropTypes from "prop-types";
export default class RackOwner extends Component {
  render() {
    const display =
      this.props.children !== AVAILABLE
        ? /\s*([^\s]+)\s[^\s]/i.exec(this.props.children)[0]
        : "AVAILABLE";

    const styles = classnames({
      tap: true,
      label: true,
      "label-success": this.props.children === AVAILABLE,
      "label-info": this.props.children === this.props.currentUser.name,
      "label-primary":
        this.props.children !== AVAILABLE &&
        this.props.children !== this.props.currentUser.name
    });

    return (
      <td
        className="tap"
        style={{
          textAlign: "center",
          paddingTop: "25px",
          paddingBottom: "25px"
        }}>
        <span className={styles}>
          {this.props.children === AVAILABLE ? "AVAILABLE" : display}
        </span>
      </td>
    );
  }
}
RackOwner.propTypes = {
  children: PropTypes.any,
  rackOwner: PropTypes.any,
  currentUser: PropTypes.any
};
