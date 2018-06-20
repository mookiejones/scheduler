import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDataGrid, { Row } from "react-data-grid";

import RowRenderer from './ProgramColorsEditor.RowRenderer';

export default class Grids extends Component {
  getInitialState() {
    return {};
  }
  onRowClick(index, row) {
    if (typeof this.props.onRowClick === "function") {
      this.props.onRowClick(this.props.programColors.program, index);
    }
  }
  render() {
    return (
      <div className="list-item">
        <div className="list-content">
          <ReactDataGrid
            rowKey="pc"
            onRowClick={this.onRowClick}
            columns={[{ key: "pc", name: this.props.programColors.program, editable: true }]}
            rowGetter={(rowidx) => {
              return this.props.programColors.colors[rowidx];
            }.bind(this)}
            rowsCount={this.props.programColors.colors.length}
            minHeight={250}
            rowRenderer={RowRenderer}
            selectedIndexes={this.props.selectedIndexes}
          />
        </div>
      </div>
    );
  }
}
Grids.propTypes = {
  onRowClick: PropTypes.func,
  programColors: PropTypes.any,
  selectedIndexes: propTypes.array
};
