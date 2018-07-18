import React, { Component } from 'react';
import * as moment from 'moment';
import {
  Grid,
  withStyles,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Paper
} from '@material-ui/core';

import PropTypes from 'prop-types';
import * as update from 'react-addons-update';
import * as Highcharts from 'highcharts';
import { HighChart } from './HighChart';
import DataService from '../../api/DataService';
import DatePicker from './DatePicker';

const defaultFormat = 'YYYY-MM-DDThh:mm';

function breakIntoSeries(arr, format) {
  const series = [];
  const s = {};
  arr.forEach((el) => {
    if (!s.name) {
      s.name = el.full_name;
      s.data = [];
    } else if (s.name === el.full_name) {
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
  });

  return series;
}

const defaultOptions = {
  credits: {
    enabled: false
  },
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
    type: 'datetime'
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
};

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  root: {
    marginTop: theme.spacing.unit * 3
    // marginRight: theme.spacing.unit * 4,
    // marginLeft: theme.spacing.unit * 4
  },
  table: {
    // minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  menu: {
    width: 200
  }
});

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
    const chartOptions = defaultOptions;

    this.state = {
      chartType: 'scatter',
      to: now,
      from: then,
      defaultOptions,
      options: { generated: moment().format('MM/DD/YYYY hh:mm:ss') },
      worsePerformers: [],
      underTen: [],
      connected: false
    };

    chartOptions.chart.type = 'scatter';
    this.onStartDateChanged = this.onStartDateChanged.bind(this);
    this.onEndDateChanged = this.onEndDateChanged.bind(this);
    this.handleChartChange = this.handleChartChange.bind(this);
  }

  handleChartChange(e) {
    debugger;
  }

  onEndDateChanged(e) {
    const value = e.target.value;

    const t = moment(value);

    this.setState({ to: t });
    this.getDriverAverages();
  }

  onStartDateChanged(e) {
    const value = e.target.value;

    const t = moment(value);

    this.setState({ from: t });
    this.getDriverAverages();
  }

  componentWillMount() {
    this.getDriverAverages();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { route } = nextProps;
    return route === 3;
  }

  componentDidUpdate(prevProps, prevState) {
    debugger;
    const { isConnected } = this.props;
    const { from, connected, to } = this.state;
    if (prevProps.route !== 3) return;
    const connectionChanged = isConnected !== connected;
    if (connectionChanged) {
      this.setState({ connected: isConnected });
    }
    if (connectionChanged || prevState.from !== from || prevState.to !== to) {
      this.getDriverAverages();
    }
  }

  onDriverSelected(e, d) {
    debugger;
  }

  getDriverAverages() {
    const { from, to, defaultOptions } = this.state;
    const params = {
      startdate: from.format('YYYY-MM-DD HH:mm:ss'),
      enddate: to.format('YYYY-MM-DD HH:mm:ss')
    };

    const format = 'MM/DD/YYYY hh:mm:ss A';

    const average = {
      name: 'average',
      type: 'spline',
      data: []
    };

    DataService.GetDriverAverages(JSON.stringify(params))
      .then((arr) => {
        if (arr.length > 0) {
          const options = update(defaultOptions, { $merge: {} });
          options.series = breakIntoSeries(arr[0], format);

          for (let i = 0; i < arr[2].length; i++) {
            average.data.push([
              moment(arr[2][i].date_handled, format).valueOf(),
              parseInt(arr[2][i].avg_seconds, 10)
            ]);
          }
          /* options.series.push(average); */
          options.generated = moment().format('MM/DD/YYYY hh:mm:ss');
          this.setState({
            options,
            worsePerformers: arr[1],
            underTen: arr[3]
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getOptions() {
    const { to, from } = this.state;
    return (
      <Grid container spacing={24}>
        <DatePicker
          label='Start Date'
          time={to.format(defaultFormat)}
          onChange={this.onStartDateChanged}
        />
        <DatePicker
          label='End Date'
          time={from.format(defaultFormat)}
          onChange={this.onEndDateChanged}
        />
      </Grid>
    );
  }

  getChart() {
    const { classes, onDriverSelected } = this.props;
    const { options, worsePerformers, underTen } = this.state;
    return (
      <Grid item>
        <div style={{ height: '30vh', overflow: 'auto' }}>
          <Paper className={classes.root}>
            <HighChart
              container='chart'
              key={options.generated}
              options={options}
            />
          </Paper>
        </div>

        <Grid container spacing={8}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Toolbar>
                <Typography variant='title'>Slowest Picks</Typography>
              </Toolbar>
              <div style={{ height: '30vh', overflow: 'auto' }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Length</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {worsePerformers.map((row, idx) => (
                      <TableRow
                        hover
                        onClick={event =>onDriverSelected(event, row)}
                        key={idx}
                      >
                        <TableCell>{row.full_name}</TableCell>
                        <TableCell>
                          {row.seconds} (~{Math.round((row.seconds / 60) * 100) / 100} minutes)
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Toolbar>
                <Typography variant='title'>Picks Under 10 seconds</Typography>
              </Toolbar>
              <div style={{ height: '30vh', overflow: 'auto' }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Number Of Picks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {underTen.map((row, idx) => (
                      <TableRow
                        hover
                        onClick={event => onDriverSelected(event, row)}
                        key={idx}
                      >
                        <TableCell>{row.full_name}</TableCell>
                        <TableCell>{row.c}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    const Options = this.getOptions();
    const Chart = this.getChart();
    const { options } = this.state;
    return !options.series ? (
      Options
    ) : (
      <Grid container>
        <Grid item xs={11}>
          {Options}
        </Grid>
        <Grid item xs={12}>
          {Chart}
        </Grid>
      </Grid>
    );
  }
}

DriverPerformance.propTypes = {
  classes: PropTypes.object.isRequired,
  isConnected: PropTypes.bool
};

export default withStyles(styles)(DriverPerformance);
