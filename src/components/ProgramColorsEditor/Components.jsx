import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactDataGrid, { Row } from 'react-data-grid';

class RowRenderer extends Component {
  scrollLeft(scrollBy) {
    //if you want freeze columns to work, you need to make sure you implement this as apass through
    this.refs.row.setScrollLeft(scrollBy);
  }

  render() {
    return (
      <div>
        <Row ref="row" {...this.props} />
      </div>
    );
  }
}

const PcCellFormatter = ({ value }) => <div>{value}</div>;
PcCellFormatter.propTypes = {
  value: PropTypes.any
};

const ReactiveBtn = ({ style, clickEvent, className, text }) => (
  <button style={style} onClick={clickEvent} className={className}>
    {text}
  </button>
);

ReactiveBtn.propTypes = {
  style: PropTypes.any,
  clickEvent: PropTypes.func,
  className: PropTypes.any,
  text: PropTypes.any
};

class Grids extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(index, row) {
    const { onRowClick, programColors } = this.props;

    onRowClick(programColors.program, index);
  }
  render() {
    const {
      programColors: { program, colors },
      selectedIndexes
    } = this.props;
    return (
      <ReactDataGrid
        rowKey="pc"
        onRowClick={this.onRowClick}
        columns={[
          {
            key: 'pc',
            name: program,
            editable: true
          }
        ]}
        rowGetter={(rowidx) => {
          return colors[rowidx];
        }}
        rowsCount={colors.length}
        minHeight={250}
        rowRenderer={RowRenderer}
        selectedIndexes={selectedIndexes}
      />
    );
  }
}

Grids.propTypes = {
  onRowClick: PropTypes.func.isRequired,
  programColors: PropTypes.any,
  selectedIndexes: PropTypes.any
};
export { PcCellFormatter, ReactiveBtn, Grids, RowRenderer };
