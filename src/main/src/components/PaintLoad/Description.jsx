import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as classnames from 'classnames';

export default class Description extends Component {
  render() {
    const { children } = this.props;
    const description = children;
    const classname = 'tap description';

    if (description !== '') {
      const style = classnames({
        tap: true,
        description: true,
        label: true,
        labelDefault:
          description !== 'Ship If Good'
          && description !== 'Build'
          && !/^(?:Do Not Ship|Red Hot !!)$/gi.test(description),
        labelDanger: /^(?:Do Not Ship|Red Hot !!)$/gi.test(description),
        labelInfo: description === 'Ship If Good',
        labelWarning: description === 'Build'
      });

      return (
        <div className={classname}>
          <span className={style}>{description}</span>
        </div>
      );
    }
    return <div className={classname}>{children}</div>;
  }
}
Description.propTypes = {
  description: PropTypes.any,
  rowData: PropTypes.any
};
