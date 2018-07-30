import React, { Component } from 'react';
import moment from 'moment';
import update from 'immutability-helper';
import { Fetch, options, URLS } from '../../shared';
import Charts from './Charts';
import ChartOptions from './ChartOptions';
import defaultChartOptions from './DefaultChartOptions';
import 'react-datepicker/dist/react-datepicker.css';
const breakIntoSeries = (arr, format) => {
  var series = [];
  var s = {};
  arr.forEach((el) => {
    if (!s.name) {
      s.name = el.full_name;
      s.data = [];
    } else {
      if (s.name === el.full_name) {
        s.data.push([
          new moment.utc(el.date_handled, format).valueOf(),
          Math.round((parseInt(el.seconds, 10) / 60) * 100) / 100
        ]);
      } else {
        series.push(update(s, { $merge: {} }));
        s.name = el.full_name;
        s.data = [];
        s.data.push([
          new moment.utc(el.date_handled, format).valueOf(),
          Math.round((parseInt(el.seconds, 10) / 60) * 100) / 100
        ]);
      }
    }
  });
  return series;
};

/**
 * @class DriverPerformance
 * @description Tracks Performance of drivers
 */
class DriverPerformance extends Component {
  /**
   * @class DriverPerformance
   * @description Constructor
   */
  constructor(props) {
    super(props);
    const now = moment();
    const then = moment().subtract(2, 'days');
    this.env = props.env;
    this.state = {
      to: now,
      from: then,
      defaultOptions: defaultChartOptions,
      options: { generated: new moment().format('MM/DD/YYYY hh:mm:ss') },
      worsePerformers: [],
      underTen: []
    };

    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
  }

  componentDidMount() {
    this.getDriverAverages();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.to !== this.state.to || prevState.from !== this.state.from) {
      this.getDriverAverages();
    }
  }
  /**
   * Gets Driver Averages from SQL *
   */
  getDriverAverages() {
    // Base URL Name

    const { from, to, defaultOptions } = this.state;

    const fmt = 'YYYY-MM-DD HH:mm:ss';

    const params = {
      startdate: from.format(fmt),
      enddate: to.format(fmt)
    };

    const opt = options(params);

    const format = 'MM/DD/YYYY hh:mm:ss A';

    Fetch(URLS.GetDriverAverages, this.env, opt)
      .then((arr) => {
        var average = {
          name: 'average',
          type: 'spline',
          data: []
        };

        var options = update(defaultOptions, { $merge: {} });
        options.series = breakIntoSeries(arr[0], format);

        for (var i = 0; i < arr[2].length; i++) {
          average.data.push([
            new moment(arr[2][i].date_handled, format).valueOf(),
            parseInt(arr[2][i].avg_seconds, 10)
          ]);
        }

        //options.series.push(average);
        options.generated = new moment().format('MM/DD/YYYY hh:mm:ss');
        this.setState({
          options: options,
          worsePerformers: arr[1],
          underTen: arr[3]
        });
      })
      .catch((error) => {
        debugger;

        // Figure this out
      });
  }
  handleToChange(value, event) {
    this.setState({ from: value });
  }
  handleFromChange(value, event) {
    this.setState({ to: value });
  }

  render() {
    const { to, from, options, worsePerformers, underTen } = this.state;

    const getChart = () => (
      <div>
        <div>
          <Charts container="chart" key={options.generated} options={options} />
        </div>
        <div style={{ display: 'flex' }}>
          <div>
            <h2>Slowest Picks</h2>
            <table
              className="table table-bordered table-hover"
              style={{ width: 'auto', margin: '10px' }}>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Length (seconds)</th>
                </tr>
              </thead>
              <tbody>
                {worsePerformers.map((row, idx) => (
                  <tr key={row.name + '-' + idx}>
                    <td style={{ width: '250px' }}>{row.full_name}</td>
                    <td style={{ width: '350px' }}>
                      {row.seconds} (~{Math.round((row.seconds / 60) * 100) /
                        100}{' '}
                      minutes)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Picks under 10 Seconds</h2>
            <table
              className="table table-bordered table-hover"
              style={{ width: 'auto' }}>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Number of Picks</th>
                </tr>
              </thead>
              <tbody>
                {underTen.map((row, idx) => (
                  <tr key={row.full_name + '-' + idx + '-underTen'}>
                    <td style={{ width: '250px' }}>{row.full_name}</td>
                    <td style={{ width: '350px' }}>{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
    const chartOptions = (
      <ChartOptions
        to={to}
        from={from}
        handleToChange={this.handleToChange}
        handleFromChange={this.handleFromChange}
      />
    );

    return (
      <div>
        {chartOptions}
        {options.series && getChart()}
      </div>
    );
  }
}

export default DriverPerformance;
