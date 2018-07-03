import React, { Component } from "react";
import PropTypes from "prop-types";

import * as classnames from "classnames";

export default class RowRenderer extends Component {
  constructor(props, context) {
    super(props, context);
    this.rowRef = React.createRef();
  }
  onKeyDown(event) {
    console.log("onKeyDown");
  }

  setScrollLeft(scrollBy) {
    this.btnRef.setScrollLeft(scrollBy);
  }
  render() {
    const myRef = (el) => (this.btnRef = el);
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

    return (
      <Row
        className={rowStyle}
        ref={myRef}
        extraClasses={rowStyle}
        {...this.props}
        onKeyDown={this.onKeyPress}
      />
    );
  }
}

RowRenderer.propTypes = {
  row: PropTypes.any,
  columns: PropTypes.array
};