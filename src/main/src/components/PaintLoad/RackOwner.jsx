import React, { Component } from 'react';
import * as classnames from 'classnames';

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

    return (
      <div
        className='tap'
        style={{
          textAlign: 'center',
          paddingTop: '25px',
          paddingBottom: '25px'
        }}
      >
        <span className={styles}>{children === AVAILABLE ? 'AVAILABLE' : display}</span>
      </div>
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
