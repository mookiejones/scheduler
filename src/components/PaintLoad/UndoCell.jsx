import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import TouchableComponent from "./TouchableComponent";
const styles = ["green", "yellow", "orange", "red", "purple", "blue"];
export default class UndoCell extends TouchableComponent {
  render() {
    const { rowData, role } = this.props;

    const answer = (
      <div
        ref={(row) => (this.row = row)}
        className={`tap undo rack-group-${
          styles[parseInt(rowData.round_pos, 10) % styles.length]
        }`}>
        {rowData.ten}
      </div>
    );

    const undo = (
      <FontAwesome
        ref={(row) => (this.row = row)}
        style={{ fontSize: "45px" }}
        className={`undo rack-group-${
          styles[parseInt(this.props.round_pos, 10) % styles.length]
        }`}
        name="undo"
      />
    );

    switch (role) {
      case "load":
        return rowData.picked_by !== "##AVAILABLE##" &&
          rowData.handled_by !== "##AVAILABLE##"
          ? undo
          : answer;

      case "stage":
        return this.props.rowData[this.props.rowData.length - 2] !==
          "##AVAILABLE##"
          ? undo
          : answer;

      case "assist":
        return this.props.rowData.picked_by === this.props.currentUser.name
          ? undo
          : answer;

      default:
        return <td />;
    }
  }
}
UndoCell.propTypes = {
  role: PropTypes.string,
  rowData: PropTypes.any,
  currentUser: PropTypes.any
};
