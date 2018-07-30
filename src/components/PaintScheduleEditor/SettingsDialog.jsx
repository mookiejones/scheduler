import React, { Component } from 'react';

import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { ColorPropType } from '../../shared/sharedTypes';
import { defaultKeys } from './RoundDataItem';
/**
 * rules come from database
 * DB:SmallProjects
 * Table: schedule_editor_color_rules
 */

import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalBody,
  Button,
  Popover,
  Tooltip
} from 'react-bootstrap';

import ReactDataGrid from 'react-data-grid';

import { FormControlEditor, FormControlFormatter } from './Editors';

import * as Addons from 'react-data-grid-addons';

const {
  Toolbar,
  Editors: { AutoComplete: AutoCompleteEditor },
  Menu: { ContextMenu, MenuItem }
} = Addons;

const SettingsContextMenu = ({ id, handleDeleteColorRule, rowIdx, idx }) => (
  <ContextMenu id={id}>
    <MenuItem data={{ rowIdx, idx }} onClick={handleDeleteColorRule}>
      Delete
    </MenuItem>
  </ContextMenu>
);

const elements = defaultKeys.sort().map((dk) => {
  return {
    id: dk,
    title: dk
  };
});

const ElementEditor = <AutoCompleteEditor options={elements} />;
/**
 * @class SettingsDialog
 */
export default class SettingsDialog extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this._columns = [
      {
        key: 'title',
        name: 'Title',
        editable: 'true',
        type: 'text',
        resizable: true
      },
      {
        key: 'value',
        name: 'Value',
        editable: 'true',
        type: 'text',
        resizable: true
      },
      {
        key: 'contains',
        name: 'Contains',

        type: 'checkbox',
        editable: 'true',
        resizable: true,
        width: 80,
        formatter: <FormControlFormatter type="checkbox" {...props} />,
        editor: <FormControlEditor type="checkbox" {...props} />
      },
      {
        key: 'element',
        name: 'Element',
        editable: 'true',
        editor: ElementEditor,
        resizable: 'true'
      },
      {
        key: 'color',
        name: 'Color',
        width: 80,
        formatter: <FormControlFormatter type="color" {...props} />,
        editor: <FormControlEditor type="color" {...props} />,
        type: 'color',
        resizable: true
      }
    ];
  }
  handleClose(e) {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleAddRow = ({ newRowIndex }) => {
    const newRow = {
      title: '',
      value: '',
      color: '',
      contains: 1
    };
    let rules = this.state.rules.slice();
    rules = update(rules, { $push: [newRow] });
    this.setState({ rules });
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const { rules, handleCommit } = this.props;

    for (let i = fromRow; i <= toRow; i++) {
      let updatedRow = update(rules[i], { $merge: updated });
      handleCommit(i, { rule: updatedRow });
    }
  };

  getRowAt = (index) => {
    const { rules } = this.props;
    if (index < 0 || index > this.getSize()) {
      return undefined;
    }
    return this.props.rules[index];
  };

  getSize = () => this.props.rules.length;
  onColumnResize(idx, width) {
    debugger;
  }
  render() {
    const { show, handleSettingsClick, handleAddColorRule } = this.props;

    return (
      <div className="modal-container">
        <Modal show={show} onHide={handleSettingsClick} bsSize="lg">
          <ModalHeader closeButton>
            <ModalTitle>Color Settings</ModalTitle>
          </ModalHeader>
          <ModalBody bsClass="modal-container">
            <ReactDataGrid
              style={{ margin: '10px' }}
              ref={(node) => (this.grid = node)}
              enableCellSelect={true}
              minHeight={300}
              columns={this._columns}
              onColumnResize={this.onColumnResize}
              rowGetter={this.getRowAt}
              rowsCount={this.getSize()}
              toolbar={<Toolbar onAddRow={handleAddColorRule} />}
              onGridRowsUpdated={this.handleGridRowsUpdated}
              contextMenu={
                <SettingsContextMenu id="colorRuleEditor" {...this.props} />
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSettingsClick}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

SettingsDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  handleSettingsClick: PropTypes.func.isRequired,
  handleAddColorRule: PropTypes.func.isRequired,
  rules: ColorPropType.isRequired,
  handleDeleteColorRule: PropTypes.func.isRequired
};
