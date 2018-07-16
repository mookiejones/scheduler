import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DriverPerformance from '../components/DriverPerformance';

class DriverPerformanceContainer extends Component {
  shouldComponentUpdate(nextProps) {
    const { route } = nextProps;
    return route === 0;
  }

  render() {
    const { route } = this.props;
    return <DriverPerformance route={route} {...this.props} />;
  }
}

DriverPerformanceContainer.propTypes = {
  route: PropTypes.number
};

DriverPerformanceContainer.defaultProps = {
  route: -1
};

export default DriverPerformanceContainer;
