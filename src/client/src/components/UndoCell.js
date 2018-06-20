import React, { Component } from "react";

const styles = ["green", "yellow", "orange", "red", "purple", "blue"];

export class UndoCell extends Component {
  render() {
    const { rowData, role } = this.props;
    const answer = (
      <td className={`tap rack-group-${styles[parseInt(rowData[3], 10) % styles.length]}`}>
        {rowData[10]}
      </td>
    );
    switch (role) {
      case "load":
        if (
          rowData[rowData.length - 3] !== "##AVAILABLE##" &&
          rowData[rowData.length - 2] !== "##AVAILABLE##"
        ) {
          return (
            <td
              style={{ fontSize: "45px" }}
              className={`undo rack-group-${
                styles[parseInt(this.props.rowData[3], 10) % styles.length]
              }`}
            >
              <i className="fa fa-undo" />
            </td>
          );
        }
        return answer;

      case "stage":
        if (this.props.rowData[this.props.rowData.length - 2] !== "##AVAILABLE##") {
          return (
            <td
              style={{ fontSize: "45px" }}
              className={`${"undo " + "rack-group-"}${
                styles[parseInt(this.props.rowData[3], 10) % styles.length]
              }`}
            >
              <i style={{ paddingLeft: "5px" }} className="fa fa-undo" />
            </td>
          );
        }
        return answer;
        break;
      case "assist":
        if (this.props.rowData[this.props.rowData.length - 1] === this.props.currentUser.name) {
          return (
            <td
              style={{ fontSize: "45px" }}
              className={`${"undo " + "rack-group-"}${
                styles[parseInt(this.props.rowData[3], 10) % styles.length]
              }`}
            >
              <i style={{ paddingLeft: "5px" }} className="fa fa-undo" />
            </td>
          );
        }
        return answer;
      default:
        return <td />;
    }
  }
}
