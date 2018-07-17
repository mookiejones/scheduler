import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
 TableHead, TableRow, TableSortLabel, TableCell
} from '@material-ui/core';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'table-header-group'
  }
};

class ScheduleEditorTableHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      c: {}
    };
  }

  componentWillMount() {
    const { rules } = this.props;
    const c = {};
    for (const rule of rules) {
      c[rule.Element] = { backgroundColor: rule.Color };
    }
    this.setState({ c });
  }

  render() {
    const { headers } = this.props;
    const { c } = this.state;
    return (
      <TableHead className={classNames(c)} style={{ display: 'block' }}>
        <TableRow hover style={{ display: 'block' }}>
          {headers.map(header => (
            <TableCell
              padding={header.padding}
              key={header.value}
              style={{ width: header.width }}
              sortDirection={header.id === 'id' ? 'asc' : false}
            >
              <TableSortLabel>{header.title}</TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

ScheduleEditorTableHead.propTypes = {
  rules: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired
};

export default withStyles(styles)(ScheduleEditorTableHead);
