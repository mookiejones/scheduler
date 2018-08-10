import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { AVAILABLE, UserPropType } from '../../shared';

const getName = (name) => {
  if (name === undefined) {
    debugger;
  }
  if (name === AVAILABLE) return name;
  let items = name.split(' ');
  return `${items[0]} ${items[1][0]}`;
};
export default class RackOwner extends Component {
  render() {
    const { children, currentUser } = this.props;

    if (children === undefined) return <div />;
    const name = getName(children);
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
        <OverlayTrigger
          placement="left"
          trigger={['hover', 'focus']}
          overlay={<Popover id="popover-basic" title={name} />}>
          <span className={styles}>
            {children === AVAILABLE ? 'AVAILABLE' : name}
          </span>
        </OverlayTrigger>
      </td>
    );
  }
}
RackOwner.propTypes = {
  currentUser: UserPropType.isRequired,
  children: PropTypes.any,
  users: PropTypes.array.isRequired
};
