import React, { Component } from 'react';
import * as moment from 'moment';
import { HC } from './HC';
var    Highcharts = require('highcharts'),
    Calendar = require('react-date-picker').Calendar,
    DateField = require('react-date-picker').DateField;
var update = require('react-addons-update');

function breakIntoSeries(arr, format) {
    var series = [];
    var s = {}
    arr.map(function (el, idx) {
        if (!s.name) {
            s.name = el.full_name;
            s.data = [];
        } else {
            if (s.name == el.full_name) {
                s.data.push([new moment.utc(el.date_handled, format).valueOf(), Math.round((parseInt(el.seconds) / 60) * 100) / 100]);
            } else { 
                series.push(update(s, { $merge: {} })); 
                s.name = el.full_name;
                s.data = [];
                s.data.push([new moment.utc(el.date_handled, format).valueOf(), Math.round((parseInt(el.seconds) / 60) * 100) / 100]);
            }
        }
    });
    return series;
}


export class DriverPerformance extends Component {
    getInitialState() {
        var now = new moment();
        var then = new moment().subtract(2, 'hours');

        return {
            endTime: now,
            startTime: then,
            defaultOptions: {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Driver Averages by Day'
                },
                xAxis: {
                    allowDecimals: false,
                    title: {
                        scalable: false
                    },
                    type: 'datetime'//,
                    //labels: {
                    //   formatter() {
                    //     return Highcharts.dateFormat('%d-%b', (this.value));
                    //   }
                    // }
                },
                yAxis: {
                    title: {
                        text: 'Average Time (Minutes)'
                    }
                },
                legend: {
                    enabled: false,
                    layout: 'horizontal',
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.y} minutes'
                        }
                    }
                },
                series: []
            },
            options: { generated: new moment().format("MM/DD/YYYY hh:mm:ss") },
            worsePerformers: [],
            underTen: []
        }
    }
    componentWillMount() {
        this.getDriverAverages();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.startTime != this.state.startTime || prevState.endTime != this.state.endTime) {
            this.getDriverAverages();
        }
    }

    getDriverAverages() {
        var request = new XMLHttpRequest();
        var url;

        var params = {
            startdate: this.state.startTime.format("YYYY-MM-DD HH:mm:ss"),
            enddate: this.state.endTime.format("YYYY-MM-DD HH:mm:ss")
        };

        if (this.state.env == "development") {
            //url = "api/paint/getDriverAverages";
            url = "api/paint/getDriverAverages?startDate" + params[0] + "&enddate=" + params[1];
        } else {
            //url = "api/paint/getDriverAverages";
            url = "api/paint/getDriverAverages?startDate" + params[0] + "&enddate=" + params[1];
        }

        request.open('GET', url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.response);
                //var arr = JSON.parse(data.d);
                var arr = data;
                var format = "MM/DD/YYYY hh:mm:ss A";

                var average = {
                    name: "average",
                    type: "spline",
                    data: []
                }

                var options = update(this.state.defaultOptions, { $merge: {} });
                options.series = breakIntoSeries(arr[0], format);

                for (var i = 0; i < arr[2].length; i++) {
                    average.data.push([new moment(arr[2][i].date_handled, format).valueOf(), parseInt(arr[2][i].avg_seconds)])
                }
                //options.series.push(average);
                options.generated = new moment().format("MM/DD/YYYY hh:mm:ss")
                this.setState({
                    options: options,
                    worsePerformers: arr[1],
                    underTen: arr[3]
                });
            } else {

            }
        };

        //var params = {
        //  startdate: this.state.startTime.format("YYYY-MM-DD HH:mm:ss"),
        //  enddate: this.state.endTime.format("YYYY-MM-DD HH:mm:ss")
        //};
        //request.send(JSON.stringify(params));
    }

    render() {
        var Options = (<div style={{ display: 'flex' }}>
            <div style={{ marginBottom: '10px' }}>
                <label>Start Date:</label><br />
                <DateField style={{ marginLeft: '25px' }}
                    dateFormat="MM/DD/YYYY HH:mm:ss"
                    onChange={(dateString, { dateMoment, timestamp }) => {
                        //document.activeElement.blur()
                        this.setState({ startTime: dateMoment });
                    }}
                    forceValidDate={true}
                    updateOnDateClick={true}
                    collapseOnDateClick={false}
                    defaultValue={this.state.startTime.valueOf()}
                >
                    <Calendar
                        navigation={true}
                        locale="en"
                        forceValidDate={true}
                        highlightWeekends={false}
                        highlightToday={true}
                        weekNumbers={false}
                        weekStartDay={0}
                    />
                </DateField>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>End Date:</label><br />
                <DateField style={{ marginLeft: '25px' }}
                    dateFormat="MM/DD/YYYY HH:mm:ss"
                    onChange={(dateString, { dateMoment, timestamp }) => {
                        //document.activeElement.blur()
                        this.setState({ endTime: dateMoment });
                    }}
                    forceValidDate={true}
                    updateOnDateClick={true}
                    collapseOnDateClick={false}
                    defaultValue={this.state.endTime.valueOf()}
                >
                    <Calendar
                        navigation={true}
                        locale="en"
                        forceValidDate={true}
                        highlightWeekends={false}
                        highlightToday={true}
                        weekNumbers={false}
                        weekStartDay={0}
                    />
                </DateField>
            </div>
        </div>);
        var Chart = (<div>
            <div>
                <HC container='chart' key={this.state.options.generated} options={this.state.options} />
            </div>
            <div style={{ display: 'flex' }}>
                <div>
                    <h2>Slowest Picks</h2>
                    <table className='table table-bordered table-hover' style={{ width: 'auto', margin: '10px' }}>
                        <thead><tr><th>Driver</th><th>Length (seconds)</th></tr></thead>
                        <tbody>{this.state.worsePerformers.map((row, idx) => { return (<tr key={row.name + "-" + idx}><td style={{ width: "250px" }}>{row.full_name}</td><td style={{ width: "350px" }}>{row.seconds} (~{Math.round(row.seconds / 60 * 100) / 100} minutes)</td></tr>) })}</tbody>
                    </table>
                </div>
                <div>
                    <h2>Picks under 10 Seconds</h2>
                    <table className='table table-bordered table-hover' style={{ width: 'auto' }}>
                        <thead><tr><th>Driver</th><th>Number of Picks</th></tr></thead>
                        <tbody>{this.state.underTen.map((row, idx) => { return (<tr key={row.full_name + "-" + idx + "-underTen"}><td style={{ width: "250px" }}>{row.full_name}</td><td style={{ width: "350px" }}>{row.c}</td></tr>) })}</tbody>
                    </table>
                </div>
            </div>
        </div>)

        if (!this.state.options.series) {
            return (Options);
        } else {
            return (
                <div>
                    {Options}
                    {Chart}
                </div>
            );
        }

    }
}

