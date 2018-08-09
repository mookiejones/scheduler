import React, { Component, Fragment } from 'react';
import moment from 'moment';
import update from 'immutability-helper';
import { Fetch, options, URLS } from '../../shared';
import Charts from './Charts';
import ChartOptions from './ChartOptions';
import defaultChartOptions from './DefaultChartOptions';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid, Row, Col, Table } from 'react-bootstrap';

/**
 * Sets Option value via path
 * @param {object} obj
 * @param {object} value
 * @param {string} path
 */
const setToValue = (obj, value, path) => {
  var a = path.split('.');
  let keys = Object.keys(obj);
  var o = obj;
  for (var i = 0; i < a.length - 1; i++) {
    var n = a[i];
    if (n in o) {
      o = o[n];
    } else {
      o[n] = {};
      o = o[n];
    }
  }
  o[a[a.length - 1]] = value;
  return obj;
};

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

/**
 *
 * @param {Array} items
 */
const getValues = (items) => {
  const format = 'MM/DD/YYYY hh:mm:ss A';
  let result = items.map((item) => [
    new moment.utc(item.date_handled, format).valueOf(),
    Math.round((parseInt(item.seconds, 10) / 60) * 100) / 100
  ]);
  return result;
};

const breakIntoSeries = (arr, format) => {
  let items = arr.map((o) => new DriverItem(o));
  let groups = groupBy(items, 'full_name');

  const series = Object.keys(groups).map((key) => {
    return { name: key, data: getValues(groups[key]) };
  });

  return series;
};

class DriverItem {
  constructor(item) {
    this.date_handled = item.date_handled;
    this.full_name = item.full_name;
    this.seconds = item.seconds;
  }

  toSeriesValue() {
    const format = 'MM/DD/YYYY hh:mm:ss A';

    return [
      new moment.utc(this.date_handled, format).valueOf(),
      Math.round((parseInt(this.seconds, 10) / 60) * 100) / 100
    ];
  }
}
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
    const then = moment().subtract(2, 'hours');
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
    this.handleOptionsChange = this.handleOptionsChange.bind(this);
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
        options.data = arr[2].map((o) => [
          new moment(o.date_handled, format).valueOf(),
          parseInt(o.avg_seconds, 10)
        ]);

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

  handleOptionsChange(path, value) {
    let options = update(this.state.options, { $merge: {} });
    options = setToValue(options, value, path);

    options = update(this.state.options, { $merge: options });

    this.setState({ options: options });
  }

  render() {
    const { to, from, options, worsePerformers, underTen } = this.state;

    const getChart = () => (
      <Grid fluid>
        <Row>
          <ChartOptions
            className="pull-right"
            to={to}
            from={from}
            handleToChange={this.handleToChange}
            handleFromChange={this.handleFromChange}
            handleOptionsChange={this.handleOptionsChange}
            options={options}
          />
        </Row>

        <Charts container="chart" key={options.generated} options={options} />

        <Row>
          <Col xs={6}>
            <h2>Slowest Picks</h2>

            <table className="table table-striped table-bordered table-hover table-condensed fixed-header">
              <thead className="thead-light">
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
          </Col>
          <Col xs={6}>
            <h2>Picks under 10 Seconds</h2>
            <table className="table    table-hover  fixed-header">
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
          </Col>
        </Row>
      </Grid>
    );

    return (
      <Fragment>
        {!options.series && (
          <ChartOptions
            className="pull-right"
            to={to}
            from={from}
            handleToChange={this.handleToChange}
            handleFromChange={this.handleFromChange}
            handleOptionsChange={this.handleOptionsChange}
            options={options}
          />
        )}
        {options.series && getChart()}
      </Fragment>
    );
  }
}

export default DriverPerformance;
