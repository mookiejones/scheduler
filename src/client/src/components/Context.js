import React, { Component } from "react";

import { Menu } from "react-data-grid-addons";

const ContextMenu = Menu.ContextMenu;
const MenuItem = Menu.MenuItem;

export class StyleCodeEditorContextMenu extends Component {
  onRowDelete(e, data) {
    if (typeof this.props.onRowDelete === "function") {
      this.props.onRowDelete(e, data);
    }
  }
  onRowInsertBelow(e, data) {
    if (typeof this.props.onRowInsertBelow === "function") {
      this.props.onRowInsertBelow(e, data);
    }
  }
  onPersistNewRow(e, data) {
    if (typeof this.props.onPersistNewRow === "function") {
      this.props.onPersistNewRow(e, data);
    }
  }
  render() {
    // let multipleSelected = this.props.multipleSelected;
    const { newRows } = this.props;
    return (
      <ContextMenu>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
          onClick={this.onPersistNewRow}
          disabled={!newRows}
        >
          Save Row(s)
        </MenuItem>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
          onClick={this.onRowInsertBelow}
        >
          Insert Row
        </MenuItem>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
          onClick={this.onRowDelete}
        >
          Delete Row
        </MenuItem>
      </ContextMenu>
    );
  }
}

export class ProgramColorsContextMenu extends Component {
  onRowDelete(e, data) {
    if (typeof this.props.shizz === "function") {
      console.log(this.props.parentKey);
      this.props.shizz(e, data);
    }
  }

  onRowAdd(e, data) {
    if (typeof this.props.onRowAdd === "function") {
      this.props.onRowAdd(e, data);
    }
  }

  render() {
    return (
      <ContextMenu>
        <MenuItem data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }} onClick={this.onRowAdd}>
          Add Row
        </MenuItem>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
          onClick={this.onRowDelete}
        >
          Delete Rows
        </MenuItem>
      </ContextMenu>
    );
  }
}
