import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
export default class Charts extends Component {
  // When the DOM is ready, create the chart.
  componentDidMount() {
    // Extend Highcharts with modules

    const { modules, container, options, type } = this.props;
    if (modules) {
      modules.forEach(function(module) {
        module(Highcharts);
      });
    }
    // Set container which the chart should render to.
    this.chart = new Highcharts[type || 'Chart'](container, options);
  }

  // Update chart when state changes
  componentDidUpdate() {
    this.chart.update(this.props.options);
  }

  //Destroy chart before unmount.
  componentWillUnmount() {
    this.chart.destroy();
  }

  //Create the div which the chart will be rendered to.
  render() {
    return <div {...this.props} id={this.props.container} />;
  }
}
