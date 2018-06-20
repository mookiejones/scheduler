import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDataGridPlugins from "react-data-grid-addons";
import { Row } from "react-data-grid";

import * as classnames from "classnames";

const AutoCompleteEditor = ReactDataGridPlugins.Editors.AutoComplete;

export default class RowRenderer extends Component {
  setScrollLeft(scrollBy) {
    this.refs.row.setScrollLeft(scrollBy);
  }
  render() {
    let colorColIdx = 7;
    const { row, columns } = this.props;
    const id = row.id || "";
    const color = (row.color || "").toLowerCase();
    const notes = (row.notes || "").toLowerCase();

    let pgc = this.props.getProgramColors(row.style_code);

    const rowStyle = classnames({
      "bg-success": id.substring(0, 4) === "TEMP",
      "bg-normal": id.substring(0, 4) !== "TEMP",
      service: color.includes("service"),
      dontship: notes.includes("do not ship"),
      shipifgood: notes.includes("ship if good"),
      build: notes.includes("build")
    });

    if (pgc === undefined) pgc = [{ color_desc: "999" }];

    if (columns[colorColIdx].key !== "color") {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].key === "color") colorColIdx = i;
      }
    }
    columns[colorColIdx].editor = <AutoCompleteEditor options={pgc} />;

    return <Row className={rowStyle} ref="row" extraClasses={rowStyle} {...this.props} />;
  }
}

RowRenderer.propTypes = {
  row: PropTypes.any,
  columns: PropTypes.array
};
