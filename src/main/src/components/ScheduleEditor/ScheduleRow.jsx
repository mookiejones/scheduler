import React, { Component } from 'react';
import { TableRow, TableCell } from '@material-ui/core';

import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { headers } from './TableConfig';
import { ColorRules } from './Rules/ColorRules';

const rules = new ColorRules();
const { styling } = rules;
styling.root = { backgroundColor: '#FFF' };

const styles = rules.styling;

class ScheduleRow extends Component {
  render() {
    const { classes, row } = this.props;

    const r = ScheduleRow.rules.parse(row);
    const cn = {};
    for (const key of Object.keys(r)) {
      cn[classes[key]] = true;
    }

    return (
      <TableRow
        className={classNames(classes.root, cn)}
        selected={this.props.isSelected}
        hover
        onClick={this.props.onSelected}
      >
        {this.props.children}
      </TableRow>
    );
  }
}
ScheduleRow.rules = rules;
ScheduleRow.propTypes = {
  row: PropTypes.any,
  onSelected: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScheduleRow);
