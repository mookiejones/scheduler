import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { utils } from 'react-bootstrap';

const {
  bootstrapUtils: { bsClass, getClassSet, prefix, splitBsProps }
} = utils;
export default class ScrollableTable extends PureComponent {
  render() {
    const { hover, bordered, condensed, striped, ...props } = this.props;
    const [bsProps, elementProps] = splitBsProps(props);
    const style = classNames({
      table: true,
      'fixed-header': true,
      'table-striped': striped,
      'table-hover': hover,
      'table-bordered': bordered,
      'table-condensed': condensed
    });

    return <table {...elementProps} className={style} />;
  }
}

ScrollableTable.defaultProps = {
  hover: false,
  bordered: false,
  condensed: false,
  striped: false
};

ScrollableTable.propTypes = {
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  bordered: PropTypes.bool,
  condensed: PropTypes.bool
};
