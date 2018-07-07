import React, { Component } from "react";
import * as classnames from "classnames";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
export default class Calculator extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  calcClick() {
    if (this.state.editing) {
      const newQty = this.input.value;

      if (this.props.rowData.picked_by === this.props.currentUser.name) {
        if (parseInt(newQty, 10) < this.props.rowData[9]) {
          this.props.updatePartialQty(parseInt(newQty, 10), this.props.rowData);
        } else {
          // var el = document.getElementById("alert")
          // $(el).fadeIn(1000);
          // setTimeout(function () {
          //    $(el).fadeOut();
          // }, 8000);
        }
      }

      this.input.value = "";
      this.setState({
        editing: !this.state.editing
      });
    } else {
      this.setState({
        editing: !this.state.editing
      });
      this.input.focus();
    }
  }
  render() {
    if (/(?:load|watch)/.test(this.props.role)) {
      if (this.props.rowData.picked_by !== "##AVAILABLE##") {
        if (this.props.rowData.handled_by !== "##AVAILABLE##") {
          return (
            <td>
              <FontAwesome name="check-square-o" />
            </td>
          );
        }
        return (
          <td>
            <FontAwesome name="truck" className="animate-flicker" />
          </td>
        );
      }
      return <td />;
    }
    const inputStyle = classnames({
      hidden: !this.state.editing
    });

    if (this.props.rowData.picked_by === this.props.currentUser.name) {
      return (
        <td className="action">
          <input
            type="tel"
            ref={(i) => (this.input = i)}
            className={inputStyle}
            name="quantity"
            style={{ width: "65px" }}
          />
          <FontAwesome name="calculator" />
          <i
            style={{ fontSize: "50px" }}
            className="fa fa-calculator"
            onClick={this.calcClick}
          />
        </td>
      );
    }
    return <td className="tap" />;
  }
}

Calculator.propTypes = {
  currentUser: PropTypes.any,
  role: PropTypes.string,
  rowData: PropTypes.any,
  updatePartialQty: PropTypes.func
};
