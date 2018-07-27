import React, { Component } from 'react';
import ReactDataGridPlugins from 'react-data-grid-addons';
import PropTypes from 'prop-types';

const {
  Menu: { ContextMenu, MenuItem }
} = ReactDataGridPlugins;

class StyleCodeEditorContextMenu extends Component {
  onRowDelete(e, data) {
    if (typeof this.props.onRowDelete === 'function') {
      this.props.onRowDelete(e, data);
    }
  }
  onRowInsertBelow(e, data) {
    if (typeof this.props.onRowInsertBelow === 'function') {
      this.props.onRowInsertBelow(e, data);
    }
  }
  onPersistNewRow(e, data) {
    if (typeof this.props.onPersistNewRow === 'function') {
      this.props.onPersistNewRow(e, data);
    }
  }
  render() {
    const { newRows, rowIdx, idx } = this.props;

    return (
      <ContextMenu>
        <MenuItem
          data={{
            rowIdx: rowIdx,
            idx: idx
          }}
          onClick={this.onPersistNewRow}
          disabled={!newRows}>
          {' '}
          Save Row(s){' '}
        </MenuItem>{' '}
        <MenuItem
          data={{
            rowIdx: rowIdx,
            idx: idx
          }}
          onClick={this.onRowInsertBelow}>
          {' '}
          Insert Row{' '}
        </MenuItem>{' '}
        <MenuItem
          data={{
            rowIdx: rowIdx,
            idx: idx
          }}
          onClick={this.onRowDelete}>
          {' '}
          Delete Row{' '}
        </MenuItem>{' '}
      </ContextMenu>
    );
  }
}

StyleCodeEditorContextMenu.propTypes = {
  idx: PropTypes.any,
  rowIdx: PropTypes.number,
  newRows: PropTypes.any,
  multipleSelected: PropTypes.any,
  onRowDelete: PropTypes.func.isRequired,
  onRowInsertBelow: PropTypes.func.isRequired,
  onPersistNewRow: PropTypes.func.isRequired
};

class ProgramColorsContextMenu extends Component {
  onRowDelete(e, data) {
    if (typeof this.props.shizz === 'function') {
      console.log(this.props.parentKey);
      this.props.shizz(e, data);
    }
  }
  onRowAdd(e, data) {
    if (typeof this.props.onRowAdd === 'function') {
      this.props.onRowAdd(e, data);
    }
  }
  render() {
    const { rowIdx, idx } = this.props;
    return (
      <ContextMenu>
        <MenuItem
          data={{
            rowIdx: rowIdx,
            idx: idx
          }}
          onClick={this.onRowAdd}>
          {' '}
          Add Row{' '}
        </MenuItem>{' '}
        <MenuItem
          data={{
            rowIdx: rowIdx,
            idx: idx
          }}
          onClick={this.onRowDelete}>
          {' '}
          Delete Rows{' '}
        </MenuItem>{' '}
      </ContextMenu>
    );
  }
}

ProgramColorsContextMenu.propTypes = {
  shizz: PropTypes.func,
  parentKey: PropTypes.any,
  onRowAdd: PropTypes.func,
  rowIdx: PropTypes.any,
  idx: PropTypes.any
};

export { StyleCodeEditorContextMenu, ProgramColorsContextMenu };
