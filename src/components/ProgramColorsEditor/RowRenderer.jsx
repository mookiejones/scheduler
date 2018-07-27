import React, { Component } from 'react';

import { Row } from 'react-data-grid';
const RowRenderer = ({ ...props }) => {
  const scrollLeft = (scrollBy) => {
    //if you want freeze columns to work, you need to make sure you implement this as apass through
    this.refs.row.setScrollLeft(scrollBy);
  };

  return (
    <div>
      <Row ref="row" {...this.props} />
    </div>
  );
};
export default RowRenderer;
