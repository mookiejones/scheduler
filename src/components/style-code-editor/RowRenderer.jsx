import React, { Component } from 'react';
import { Row } from 'react-data-grid';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Editors, Formatters } from 'react-data-grid-addons';
const { DropDownFormatter } = Formatters;
const { DropDownEditor } = Editors;
export default class RowRenderer extends Component {
  constructor(props) {
    super(props);
    this.setRef = (element) => {
      this.rowRef = element;
    };
  }
  setScrollLeft(scrollBy) {
    this.rowRef.setScrollLeft(scrollBy);
  }
  render() {
    const { row, columns, programs } = this.props;
    const id = row.id.toString();

    var rowStyle = classnames({
      'bg-success': id.substring(0, 4) === 'TEMP',
      'bg-normal': id.substring(0, 4) !== 'TEMP'
    });

    const programColIdx = columns.findIndex((o) => o.key === 'programname');
    columns[programColIdx].editor = <DropDownEditor options={programs} />;
    columns[programColIdx].formatter = (
      <DropDownFormatter options={programs} value={row.program || ''} />
    );
    //columns[programColIdx].editor = <DropDownEditor options={programs} />
    //columns[programColIdx].formatter = <DropDownFormatter options={programs} value={row.program || ""}/>

    return (
      <Row
        className={rowStyle}
        ref={this.setRef}
        extraClasses={rowStyle}
        {...this.props}
      />
    );
  }
}

RowRenderer.propTypes = {
  row: PropTypes.any,
  columns: PropTypes.any,
  getPrograms: PropTypes.func,
  programs: PropTypes.any
};
