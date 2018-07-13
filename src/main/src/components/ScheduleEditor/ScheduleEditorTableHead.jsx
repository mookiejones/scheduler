import React from 'react';
import PropTypes from 'prop-types';

import {
 TableHead, TableRow, TableSortLabel, TableCell
} from '@material-ui/core';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const ScheduleEditorTableHead = ({ rules, headers, ...props }) => {
  const c = {};
  for (const rule of rules) {
    c[rule.Name] = { backgroundColor: rule.Color };
  }
  return (
    <TableHead>
      <TableRow className={classNames(c)}>
        {headers.map((header, idx) => (
          <TableCell
            padding={header.padding}
            key={`header-${idx}`}
            style={{ width: header.width }}
            sortDirection={header.id === 'id' ? 'asc' : false}
          >
            <TableSortLabel>{header.title}</TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

ScheduleEditorTableHead.propTypes = {
  rules: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired
};

export default ScheduleEditorTableHead;
