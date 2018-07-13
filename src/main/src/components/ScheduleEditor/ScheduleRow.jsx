import React, { Component } from 'react';
import { TableRow, TableCell, Input } from '@material-ui/core';

import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import KeyBinding from 'react-keybinding-component';
import { ColorRules } from './Rules/ColorRules';

const rules = new ColorRules();

const styles = theme => ({
  root: {
    color: 'red',
    fontSize: '0.3rem',
    backgroundColor: '#FFF'
  },
  selected: {
    fontSize: ' 0.8125rem!important'
  }
});

const { styling } = rules;
styling.root = { backgroundColor: '#FFF' };

// const styles = rules.styling;

class ScheduleRow extends Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  addItem(event) {
    debugger;
  }

  removeItem(event) {
    debugger;
  }

  onChange({ target: { name, value } }) {
    const row = this.props.row;
    row[name] = value;
    this.props.handleRowChanged(row, this.props.index);
  }

  onKeyPressed(e) {
    const { key } = e;
    const { isSelected, handleKeyPress } = this.props;
    if (!isSelected) return;
    if (key === 'Escape') {
      handleKeyPress(e);
    }
  }

  render() {
    const {
 classes, row, isSelected, onSelected, headers
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

    const getElement = (header, isSelected, row) => {
      const { value, type } = header;
      if (header.readonly | !isSelected) {
        return row[header.value];
      }
      return (
        <Input
          autoComplete='ok hi-there wtf'
          name={value}
          type={type}
          fullWidth={false}
          value={row[value]}
          onChange={this.onChange}
          disableUnderline
        />
      );
    };

    // const color = classes.row.selectedRow;
    return (
      <TableRow
        className={classNames(classes.row, { [classes.selected]: isSelected })}
        selected={isSelected}
        hover
        onClick={onSelected}
      >
        {isSelected && (
          <KeyBinding onKey={this.onKeyPressed} type='keyup' preventInputConflict elem={TableRow} />
        )}

        {headers.map((header, idx) => (
          <TableCell padding={header.padding} key={`cell-${idx}`} width={header.width}>
            {getElement(header, isSelected, row)}

            {/* {CheckReadOnly(header, isSelected, row)} */}
          </TableCell>
        ))}
        {this.props.children}
        {/* <ContextMenuTrigger style={{ display: 'flex' }} id={rowId}>
          {children}
        </ContextMenuTrigger> */}
      </TableRow>
    );
  }
}
ScheduleRow.rules = rules;
ScheduleRow.propTypes = {
  /**
   * handles Key Press for unselecting rows
   */
  handleKeyPress: PropTypes.func,

  /**
   * isSelected
   */
  isSelected: PropTypes.bool.isRequired,

  /**
   * headers
   */
  headers: PropTypes.array,
  index: PropTypes.number.isRequired,
  row: PropTypes.any,
  onSelected: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,

  handleRowChanged: PropTypes.func.isRequired
};

ScheduleRow.defaultProps = {
  isSelected: false,
  index: -1
};

export default withStyles(styles)(ScheduleRow);
