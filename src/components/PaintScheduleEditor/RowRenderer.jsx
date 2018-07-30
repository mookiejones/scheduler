import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import ReactDataGridPlugins from 'react-data-grid-addons';

const {
  Editors: { AutoComplete }
} = ReactDataGridPlugins;

/**
 * @class RowRenderer
 */
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
    var colorColIdx = 7;
    const { row, columns, getProgramColors, rules } = this.props;

    var id = row.id || '';
    var color = (row.color || '').toLowerCase();
    var notes = (row.notes || '').toLowerCase();

    var pgc = getProgramColors(row.style_code);
    let c = rules.map((o) => {
      let result = false;

      if (o.contains) {
        let regex = new RegExp(o.value, 'ig');
        result = regex.test(row[o.element]);
      } else {
        result = row[o.element] === o.value;
      }
      let obj = {};
      obj[o.title] = result;
      return obj;
    });
    c['bg-success'] = id.substring(0, 4) === 'TEMP';
    c['bg-normal'] = id.substring(0, 4) !== 'TEMP';
    var rowStyle = classnames(c);

    if (pgc === undefined) pgc = [{ color_desc: '999' }];

    if (columns[colorColIdx].key !== 'color') {
      for (var i = 0; i < columns.length; i++) {
        if (columns[i].key === 'color') colorColIdx = i;
      }
    }
    columns[colorColIdx].editor = <AutoComplete options={pgc} />;

    return (
      <ReactDataGrid.Row
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
  getProgramColors: PropTypes.func,
  rules: PropTypes.array.isRequired
};
