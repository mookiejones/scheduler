import { Row } from "react-data-grid";
import React, { Component } from "react";

export default class RowRenderer extends Component {
  setScrollLeft(scrollBy) {
    // if you want freeze columns to work, you need to make sure you implement this as apass through
    this.refs.row.setScrollLeft(scrollBy);
  }
  render() {
    return (
      <div>
        <Row ref="row" {...this.props} />
      </div>
    );
  }
}
