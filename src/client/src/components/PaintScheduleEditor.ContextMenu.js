import React from "react";
import PropTypes from "prop-types";
import ReactDataGridPlugins from "react-data-grid-addons";

const { ContextMenu, MenuItem, SubMenu } = ReactDataGridPlugins.Menu;

const propTypes = {
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

class PaintScheduleEditorContextMenu extends ContextMenu {
  onRowDelete(e, data) {
    if (typeof this.props.onRowDelete === "function") {
      this.props.onRowDelete(e, data);
    }
  }
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
    const { multipleSelected, newRows } = this.props;

    return (
      <ContextMenu>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
          onClick={this.onPersistNewRow}
          disabled={!newRows}
        >
          Save Row(s)
        </MenuItem>
        <SubMenu title="Insert Row" disabled={multipleSelected}>
          <MenuItem
            data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
            onClick={this.onRowInsertBelow}
          >
            Below
          </MenuItem>
          <MenuItem
            data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
            onClick={this.onRowInsertAbove}
          >
            Above
          </MenuItem>
        </SubMenu>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }}
          onClick={this.onRowDelete}
          disabled={multipleSelected}
        >
          Delete Row
        </MenuItem>
      </ContextMenu>
    );
  }
}

PaintScheduleEditorContextMenu.propTypes = propTypes;

export default PaintScheduleEditorContextMenu;
