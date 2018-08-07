import React, { PureComponent, Fragment } from 'react';
import { OverlayTrigger, Image, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

class UserIcon extends PureComponent {
  render() {
    const { user, forAlert } = this.props;

    const overlay = (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="tooltip">{user.name}</Tooltip>}>
        <Image
          src={`data:image/png;base64,${user.img}`}
          circle
          style={{ height: '65px' }}
        />
      </OverlayTrigger>
    );

    return forAlert ? (
      <Fragment>
        <h4>{`${user.name} just logged in`}</h4>
        {overlay}
      </Fragment>
    ) : (
      overlay
    );
  }
}

UserIcon.propTypes = {
  user: PropTypes.any,
  forAlert: PropTypes.bool
};

UserIcon.defaultProps = {
  forAlert: false
};
export default UserIcon;
