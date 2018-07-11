import React, { Container } from 'react';
import PropTypes from 'prop-types';
import Main from '../components/PaintLoad/Main';

const PaintAppContainer = ({ ...props }) => <Main {...props} />;
PaintAppContainer.propTypes = {
  route: PropTypes.number.isRequired
};

export default PaintAppContainer;
