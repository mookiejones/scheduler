import React, { Component } from 'react';

import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { ColorPropType } from '../../shared/sharedTypes';

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
import { Toolbar } from 'react-data-grid-addons';
const {
  Menu: { ContextMenu, MenuItem, SubMenu }
} = require('react-data-grid-addons');

const SettingsContextMenu = ({ id, handleDeleteColorRule, rowIdx, idx }) => (
  <ContextMenu id={id}>
    <MenuItem data={{ rowIdx, idx }} onClick={handleDeleteColorRule}>
      Delete
    </MenuItem>
  </ContextMenu>
);

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
        type: 'text',
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
    this.handleChange = this.handleChange.bind(this);
  }
  handleClose(e) {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange(orig, item) {
    let rule = this.state.rules.findIndex((r) => r.id === orig.id);
    debugger;
    const rs = update(this.state.rules[rule], { $merge: item });
    this.setState({ rules: this.state.rules });
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
    let rules = this.props.rules.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rules[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });
      rules[i] = updatedRow;
    }
    this.setState({ rules });
  };

  getRowAt = (index) => {
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
    const { show, handleSettingsClick, rules, handleAddColorRule } = this.props;
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );

    const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

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
