import React, { Component } from "react";
import PropTypes from "prop-types";
import * as classnames from "classnames";
import { Label } from "react-bootstrap";

export default class Description extends Component {
  render() {
    let description = this.props.description;

    let classname = "tap description";
    // let result = <td className={classname}>{this.props.children}</td>;

    if (description !== "") {
      const style = classnames({
        tap: true,
        description: true,
        label: true,
        "label-default":
          description != "Ship If Good" &&
          description != "Build" &&
          !/^(?:Do Not Ship|Red Hot !!)$/gi.test(description),
        "label-danger": /^(?:Do Not Ship|Red Hot !!)$/gi.test(description),
        "label-info": description === "Ship If Good",
        "label-warning": description === "Build"
      });

      return (
        <td className={classname}>
          <div className={classname}>
            <span className={style}>{this.props.rowData.description}</span>
          </div>
        </td>
      );
    }
    return <td className={classname}>{this.props.children}</td>;
  }
}
Description.propTypes = {
  rowData: PropTypes.any
};
