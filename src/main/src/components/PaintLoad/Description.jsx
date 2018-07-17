import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as classnames from 'classnames';

export default class Description extends Component {
  render() {
    const { description, children } = this.props;

    const classname = 'tap description';

    if (description !== '') {
      const style = classnames({
        tap: true,
        description: true,
        label: true,
        'label-default':
          description !== 'Ship If Good'
          && description !== 'Build'
          && !/^(?:Do Not Ship|Red Hot !!)$/gi.test(description),
        'label-danger': /^(?:Do Not Ship|Red Hot !!)$/gi.test(description),
        'label-info': description === 'Ship If Good',
        'label-warning': description === 'Build'
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
