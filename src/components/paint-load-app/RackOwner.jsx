import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AVAILABLE } from './Constants';

export default class RackOwner extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    debugger;
  }
  render() {
    const { children, currentUser } = this.props;
    if (children !== AVAILABLE) {
      var name = children.split(' ');
      var display = `${name[0]} ${name[1][0]}`;
    }

    const styles = classnames({
      tap: true,
      label: true,
      'label-success': children === AVAILABLE,
      'label-info': children === currentUser.name,
      'label-primary': children !== AVAILABLE && children !== currentUser.name
    });
    return (
      <td
        className="tap"
        style={{
          textAlign: 'center',
          paddingTop: '25px',
          paddingBottom: '25px'
        }}>
        <span className={styles}>
          {children === AVAILABLE ? 'AVAILABLE' : display}
        </span>
      </td>
    );
  }
}
RackOwner.propTypes = {
  currentUser: PropTypes.object,
  children: PropTypes.any
};
