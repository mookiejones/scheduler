import React, { Component } from "react";
import * as classnames from "classnames";
import PropTypes from "prop-types";

export default class Calculator extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false,
    };
  }

  calcClick() {
    if (this.state.editing) {
      const newQty = this.input.value;

      if (
        this.props.rowData[this.props.rowData.length - 1] ===
        this.props.currentUser.name
      ) {
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
        editing: !this.state.editing,
      });
    } else {
      this.setState({
        editing: !this.state.editing,
      });
      this.input.focus();
    }
  }
  render() {
    if (this.props.role === "load" || this.props.role === "watch") {
      if (
        this.props.rowData[this.props.rowData.length - 1] !== "##AVAILABLE##"
      ) {
        if (
          this.props.rowData[this.props.rowData.length - 2] !== "##AVAILABLE##"
        ) {
          return (
            <td>
              <i
                style={{ fontSize: "50px" }}
                className="fa fa-check-square-o"
                aria-hidden="true"
              />
            </td>
          );
        }
        return (
          <td>
            <i
              style={{ fontSize: "50px" }}
              className="fa fa-truck animate-flicker"
              id=""
            />
          </td>
        );
      }
      return <td />;
    }
    const inputStyle = classnames({
      hidden: !this.state.editing,
    });

    if (
      this.props.rowData[this.props.rowData.length - 1] ===
      this.props.currentUser.name
    ) {
      return (
        <td className="action">
          <input
            type="tel"
            ref={i => (this.input = i)}
            className={inputStyle}
            name="quantity"
            style={{ width: "65px" }}
          />
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
  rowData: PropTypes.array,
  updatePartialQty: PropTypes.func,
};
