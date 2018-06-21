import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDataGridPlugins from "react-data-grid-addons";

const {
  Menu: { ContextMenu, MenuItem, SubMenu }
} = require("react-data-grid-addons");

export default class PaintScheduleEditorContextMenu extends Component {
  static propTypes = {
    id: PropTypes.string,
    rowIdx: PropTypes.number,
    idx: PropTypes.number,
    onRowDelete: PropTypes.func,
    onDeleteSelectedRows: PropTypes.func,
    onRowInsertAbove: PropTypes.func,
    onRowInsertBelow: PropTypes.func,
    onCopyToNewRound: PropTypes.func,
    onCopyToEndOfRound: PropTypes.func,
    onCopySelectedAbove: PropTypes.func,
    onCopySelectedBelow: PropTypes.func,
    onPersistNewRow: PropTypes.func,
    multipleSelected: PropTypes.bool,
    newRows: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this.self = this;
  }
  onRowDelete = (e, data) => {
    if (typeof this.props.onRowDelete === "function") {
      this.props.onRowDelete(e, data);
    }
  };
  onDeleteSelectedRows(e, data) {
    if (typeof this.props.onDeleteSelectedRows === "function") {
      this.props.onDeleteSelectedRows(e, data);
    }
  }
  onRowInsertAbove(e, data) {
    if (typeof this.props.onRowInsertAbove === "function") {
      this.props.onRowInsertAbove(e, data);
    }
  }
  onRowInsertBelow(e, data) {
    if (typeof this.props.onRowInsertBelow === "function") {
      this.props.onRowInsertBelow(e, data);
    }
  }
  onCopyToNewRound(e, data) {
    if (typeof this.props.onCopyToNewRound === "function") {
      this.props.onCopyToNewRound(e, data);
    }
  }
  onCopyToEndOfRound(e, data) {
    if (typeof this.props.onCopyToEndOfRound === "function") {
      this.props.onCopyToEndOfRound(e, data);
    }
  }
  onCopySelectedAbove(e, data) {
    if (typeof this.props.onCopySelectedAbove === "function") {
      this.props.onCopySelectedAbove(e, data);
    }
  }
  onCopySelectedBelow(e, data) {
    if (typeof this.props.onCopySelectedBelow === "function") {
      this.props.onCopySelectedBelow(e, data);
    }
  }
  onPersistNewRow(e, data) {
    if (typeof this.props.onPersistNewRow === "function") {
      this.props.onPersistNewRow(e, data);
    }
  }

  render() {
    const { id, idx, rowIdx, multipleSelected, newRows, onRowDelete } = this.props;

    return (
      <ContextMenu id={id}>
        {/* Save Rows */}
        <MenuItem data={{ rowIdx, idx }} onClick={this.onPersistNewRow} disabled={!newRows}>
          Save Row(s)
        </MenuItem>
        {/* Insert Row */}
        <SubMenu title="Insert Row" disabled={multipleSelected}>
          <MenuItem data={{ rowIdx, idx }} onClick={this.onRowInsertBelow}>
            Below
          </MenuItem>
          <MenuItem data={{ rowIdx, idx }} onClick={this.onRowInsertAbove}>
            Above
          </MenuItem>
        </SubMenu>
        {/* Delete Row */}
        <MenuItem data={{ rowIdx, idx }} onClick={this.onRowDelete} disabled={multipleSelected}>
          Delete Row
        </MenuItem>
      </ContextMenu>
    );
  }
}
