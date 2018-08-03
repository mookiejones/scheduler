import React from 'react';
import PropTypes from 'prop-types';
import '../../css/context-menu.css';

const {
  Menu: { ContextMenu, MenuItem, SubMenu }
} = require('react-data-grid-addons');

const PaintScheduleEditorContextMenu = ({
  id,
  multipleSelected,
  newRows,
  idx,
  rowIdx,
  onRowDelete,
  onRowInsertAbove,
  onRowInsertBelow,
  onPersistNewRow
}) => (
  <ContextMenu id={id}>
    <MenuItem
      data={{ rowIdx, idx }}
      onClick={onPersistNewRow}
      disabled={!newRows}>
      Save Row(s)
    </MenuItem>
    <SubMenu title="Insert Row" disabled={multipleSelected}>
      <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertBelow}>
        Below
      </MenuItem>
      <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertAbove}>
        Above
      </MenuItem>
    </SubMenu>
    <MenuItem
      data={{ rowIdx, idx }}
      onClick={onRowDelete}
      disabled={multipleSelected}>
      Delete Row
    </MenuItem>
  </ContextMenu>
);

PaintScheduleEditorContextMenu.propTypes = {
  onRowDelete: PropTypes.func.isRequired,
  onDeleteSelectedRows: PropTypes.func.isRequired,
  onRowInsertAbove: PropTypes.func.isRequired,
  onRowInsertBelow: PropTypes.func.isRequired,
  onCopyToNewRound: PropTypes.func.isRequired,
  onCopyToEndOfRound: PropTypes.func.isRequired,
  onCopySelectedAbove: PropTypes.func.isRequired,
  onCopySelectedBelow: PropTypes.func.isRequired,
  onPersistNewRow: PropTypes.func.isRequired,
  multipleSelected: PropTypes.any,
  newRows: PropTypes.any,
  rowIdx: PropTypes.any,
  idx: PropTypes.any
};

export default PaintScheduleEditorContextMenu;
