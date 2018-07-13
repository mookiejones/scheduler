import React, { Component } from 'react';
import { TableRow, TableCell } from '@material-ui/core';

import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ColorRules } from './Rules/ColorRules';

const rules = new ColorRules();
const { styling } = rules;
styling.root = { backgroundColor: '#FFF' };

const styles = rules.styling;

class ScheduleRow extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  addItem(event) {
    debugger;
  }

  removeItem(event) {
    debugger;
  }

  onChange({ target: { name, value } }) {
    debugger;
    const row = this.props.row;
    row[name] = value;
    this.props.handleRowChanged(row, this.props.index);
  }

  render() {
    const {
 classes, row, isSelected, onSelected, headers, children
} = this.props;

    const r = ScheduleRow.rules.parse(row);
    const cn = {};
    for (const key of Object.keys(r)) {
      cn[classes[key]] = true;
    }
    const rowId = `row-trigger-${row.id}`;
    const d = {
      some: 'some_data',
      more: 'some_more'
    };

    const CheckReadOnly = (header, isSelected, row) => {
      if (header.type !== 'ReadOnly' && isSelected) {
        return (
          <input
            name={header.value}
            type={header.format}
            value={row[header.value]}
            onChange={this.onChange}
          />
        );
      }
      return row[header.value];
    };

    return (
      <TableRow
        className={classNames(classes.root, cn)}
        selected={isSelected}
        hover
        onClick={onSelected}
      >
        {headers.map((header, idx) => (
          <TableCell padding={header.padding} key={`cell-${idx}`} width={header.width}>
            {CheckReadOnly(header, isSelected, row)}
          </TableCell>
        ))}
        {children}
        {/* <ContextMenuTrigger style={{ display: 'flex' }} id={rowId}>
          {children}
        </ContextMenuTrigger> */}
      </TableRow>
    );
  }
}
ScheduleRow.rules = rules;
ScheduleRow.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  headers: PropTypes.array,
  index: PropTypes.number.isRequired,
  row: PropTypes.any,
  onSelected: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  handleRowChanged: PropTypes.func.isRequired
};

export default withStyles(styles)(ScheduleRow);
