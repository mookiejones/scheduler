import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DriverPerformance from '../components/DriverPerformance';

class DriverPerformanceContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    debugger;
  }
  render() {
    const { route } = this.props;
    return <DriverPerformance route={route} {...this.props} />;
  }
}

DriverPerformanceContainer.propTypes = {
  route: PropTypes.number
};
export default DriverPerformanceContainer;
