import React from 'react';
import PropTypes from 'prop-types';
import Main from '../components/PaintLoad/Main';

const PaintAppContainer = ({ ...props }) => <Main {...props} />;
PaintAppContainer.propTypes = {
  route: PropTypes.number.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.any,
    img: PropTypes.string
  }).isRequired,
  handleConnectionStateChanged: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired
};

export default PaintAppContainer;
