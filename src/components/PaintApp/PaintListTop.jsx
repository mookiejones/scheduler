import React from 'react';
import UserIcon from '../UserIcon';
import PropTypes from 'prop-types';
import { UserPropType } from '../../shared';
import { Badge } from 'react-bootstrap';
const PaintListTop = ({
  title,
  currentRoundNumber,
  currentRevision,
  currentUser
}) => {
  const style = {
    ul: { padding: '10' },
    currentRound: {
      margin: '30px 15px 0px 15px'
    },
    rework: {
      margin: '23px 15px 0px 15px'
    }
  };
  return (
    <ul className="nav nav-pills" role="tablist" style={style.ul}>
      <li role="presentation">
        <h1>{title}</h1>
      </li>
      <li role="presentation" style={style.currentRound}>
        Current Round <span className="badge">{currentRoundNumber}</span>
      </li>
      <li role="presentation" style={style.currentRound}>
        Schedule Revision <Badge>{currentRevision}</Badge>
      </li>
      <li style={style.rework}>
        <div className="form-group">
          <input
            type="checkbox"
            name="rework-checkbox"
            id="rework-checkbox"
            autoComplete="off"
          />
        </div>
      </li>
      <li role="presentation" className="pull-right">
        <UserIcon user={currentUser} />
      </li>
    </ul>
  );
};

PaintListTop.propTypes = {
  title: PropTypes.string.isRequired,
  currentRoundNumber: PropTypes.any.isRequired,
  currentRevision: PropTypes.any.isRequired,
  currentUser: UserPropType
};

export default PaintListTop;
