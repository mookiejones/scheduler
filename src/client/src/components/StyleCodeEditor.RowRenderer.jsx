import React, { Component } from "react";
import { Row } from "react-data-grid";
import * as classnames from "classnames";
// import { Editors, Formatters } from "react-data-grid-addons";

export default class RowRenderer extends Component {
  setScrollLeft(scrollBy) {
    this.refs.row.setScrollLeft(scrollBy);
  }
  render() {
    let programColIdx = -1;
    const row = this.props.row;
    const columns = this.props.columns;
    const programs = this.props.getPrograms();

    const rowStyle = classnames({
      "bg-success": row.id.substring(0, 4) === "TEMP",
      "bg-normal": row.id.substring(0, 4) !== "TEMP"
    });

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].key === "program") programColIdx = i;
    }

    // columns[programColIdx].editor = <DropDownEditor options={programs} />
    // columns[programColIdx].formatter = <DropDownFormatter options={programs} value={row.program || ""}/>

    return <Row className={rowStyle} ref="row" extraClasses={rowStyle} {...this.props} />;
  }
}
