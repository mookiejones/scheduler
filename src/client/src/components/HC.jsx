import React, { Component } from 'react';
import * as Highcharts from 'highcharts';
export class HC extends Component {
    // When the DOM is ready, create the chart.
    componentDidMount() {
        // Extend Highcharts with modules

        if (this.props.modules) {
            this.props.modules.forEach(function (module) {
                module(Highcharts);
            });
        }
        // Set container which the chart should render to.
        this.chart = new Highcharts[this.props.type || "Chart"](
            this.props.container,
            this.props.options
        );
    }
    /**
     * Update chart when state changes
     **/
    
    componentDidUpdate() {
        this.chart.update(this.props.options);
    }
    /**
     * Destroy chart before unmount.
     */
    
    componentWillUnmount() {
        this.chart.destroy();
    }
    
    /**
     * Create the div which the chart will be rendered to.
     */
    render() {
        return (
            <div id={this.props.container}/>
            )

    }
}
