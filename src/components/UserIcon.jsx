import React, { PureComponent } from 'react';
import { OverlayTrigger, Image, Tooltip, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const getUserName = (name) => {
  let split = name.split(' ');
  if (split.length === 0) return name;
  return `${split[0]} ${split[1][0]}`;
};
class UserIcon extends PureComponent {
  render() {
    const { user, forAlert } = this.props;
    let imgSize = forAlert ? '-webkit-fill-available' : '65px';

    const overlay = (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="tooltip">{user.name}</Tooltip>}>
        <div
          className="card"
          style={{ borderRadius: '50%', borderWidth: '2px' }}>
          <Image
            src={`data:image/png;base64,${user.img}`}
            style={{ height: imgSize, width: imgSize }}
          />
        </div>
      </OverlayTrigger>
    );

    return forAlert ? (
      <div className="row" style={{ border: 'none', alignItems: 'center' }}>
        <div className="col-sm-10">
          <span style={{ fontSize: 'x-small' }}>{`${getUserName(
            user.name
          )} just logged in`}</span>
        </div>
        <div className="col-sm-2" style={{ marginRight: '10px' }}>
          {overlay}
        </div>
      </div>
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
