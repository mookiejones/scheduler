import React, { Component } from 'react';
import * as classnames from 'classnames';
import { Badge, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { AVAILABLE } from '../../Constants';

export default class RackOwner extends Component {
  render() {
    const { children, currentUser } = this.props;
    const display = children !== AVAILABLE ? /\s*([^\s]+)\s[^\s]/i.exec(children)[0] : 'AVAILABLE';

    const styles = classnames({
      tap: true,
      label: true,
      'label-success': children === AVAILABLE,
      'label-info': children === currentUser.name,
      'label-primary': children !== AVAILABLE && children !== currentUser.name
    });
    if (children === AVAILABLE) {
      return (
        <div
          className='tap'
          style={{
            textAlign: 'center',
            paddingTop: '25px',
            paddingBottom: '25px'
          }}
        >
          <Typography>{display}</Typography>
          {/* <span className={styles}>{display}</span> */}
        </div>
      );
    }
    return (
      <Badge color='primary' badgeContent='hi'>
        {display}
      </Badge>
    );
  }
}
RackOwner.propTypes = {
  rackOwner: PropTypes.any,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.any,
    img: PropTypes.string,
    imgPath: PropTypes.string
  }).isRequired
};
