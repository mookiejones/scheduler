import React, { Component } from "react";
import * as moment from "moment";
import { HighChart } from "./HighChart";
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
} from "@material-ui/core";

import PropTypes from "prop-types";
import * as update from "react-addons-update";
import * as Highcharts from "highcharts";
import DataService from "../../api/DataService";
import DatePicker from "./DatePicker";

const defaultFormat = "YYYY-MM-DDThh:mm";

function breakIntoSeries(arr, format) {
  const series = [];
  const s = {};
  arr.forEach(el => {
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
    type: "scatter",
    zoomType: "xy"
  },
  title: {
    text: "Driver Averages by Day"
  },
  xAxis: {
    allowDecimals: false,
    title: {
      scalable: false
    },
    type: "datetime"
  },
  yAxis: {
    title: {
      text: "Average Time (Minutes)"
    }
  },
  legend: {
    enabled: false,
    layout: "horizontal",
    backgroundColor:
      (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || "#FFFFFF"
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 5,
        states: {
          hover: {
            enabled: true,
            lineColor: "rgb(100,100,100)"
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
        headerFormat: "<b>{series.name}</b><br>",
        pointFormat: "{point.y} minutes"
      }
    }
  },
  series: []
};

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
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
  constructor(props, context) {
    super(props, context);

    const now = moment();
    const then = moment().subtract(2, "days");
    let chartOptions = defaultOptions;

    this.state = {
      chartType: "scatter",
      to: now,
      from: then,
      defaultOptions: defaultOptions,
      options: { generated: moment().format("MM/DD/YYYY hh:mm:ss") },
      worsePerformers: [],
      underTen: [],
      connected: false
    };

    chartOptions.chart.type = this.state.chartType;
    this.onStartDateChanged = this.onStartDateChanged.bind(this);
    this.onEndDateChanged = this.onEndDateChanged.bind(this);
    this.handleChartChange = this.handleChartChange.bind(this);
  }

  handleChartChange(e) {
    debugger;
  }
  onEndDateChanged(e) {
    let value = e.target.value;

    let t = moment(value);

    this.setState({ to: t });
    this.getDriverAverages();
  }
  onStartDateChanged(e) {
    let value = e.target.value;

    let t = moment(value);

    this.setState({ from: t });
    this.getDriverAverages();
  }

  componentDidMount() {
    this.getDriverAverages();
  }

  componentDidUpdate(prevProps, prevState) {
    let connectionChanged = this.props.isConnected !== this.state.connected;
    if (connectionChanged) {
      this.setState({ connected: this.props.isConnected });
    }
    if (
      connectionChanged ||
      prevState.from !== this.state.from ||
      prevState.to !== this.state.to
    ) {
      this.getDriverAverages();
    }
  }
  onDriverSelected(e, d) {
    debugger;
  }
  getDriverAverages() {
    const params = {
      startdate: this.state.from.format("YYYY-MM-DD HH:mm:ss"),
      enddate: this.state.to.format("YYYY-MM-DD HH:mm:ss")
    };

    const format = "MM/DD/YYYY hh:mm:ss A";

    const average = {
      name: "average",
      type: "spline",
      data: []
    };

    DataService.GetDriverAverages(JSON.stringify(params))
      .then(arr => {
        if (arr.length > 0) {
          const options = update(this.state.defaultOptions, { $merge: {} });
          options.series = breakIntoSeries(arr[0], format);

          for (let i = 0; i < arr[2].length; i++) {
            average.data.push([
              moment(arr[2][i].date_handled, format).valueOf(),
              parseInt(arr[2][i].avg_seconds, 10)
            ]);
          }
          /* options.series.push(average); */
          options.generated = moment().format("MM/DD/YYYY hh:mm:ss");
          this.setState({
            options,
            worsePerformers: arr[1],
            underTen: arr[3]
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  getOptions() {
    return (
      <Grid container spacing={24}>
        <DatePicker
          label="Start Date"
          time={this.state.to.format(defaultFormat)}
          onChange={this.onStartDateChanged}
        />
        <DatePicker
          label="End Date"
          time={this.state.from.format(defaultFormat)}
          onChange={this.onEndDateChanged}
        />
      </Grid>
    );
  }

  getChart() {
    const { classes } = this.props;
    return (
      <Grid item>
        <div style={{ height: "30vh", overflow: "auto" }}>
          <Paper className={classes.root}>
            <HighChart
              container="chart"
              key={this.state.options.generated}
              options={this.state.options}
            />
          </Paper>
        </div>

        <Grid container spacing={8}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Toolbar>
                <Typography variant="title">Slowest Picks</Typography>
              </Toolbar>
              <div style={{ height: "30vh", overflow: "auto" }}>
                <Table aria-labelledby="tableTitle" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Length</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.worsePerformers.map((row, idx) => (
                      <TableRow
                        hover
                        onClick={event =>
                          this.props.onDriverSelected(event, row)
                        }
                        key={idx}>
                        <TableCell>{row.full_name}</TableCell>
                        <TableCell>
                          {row.seconds} (~{Math.round(
                            (row.seconds / 60) * 100
                          ) / 100}{" "}
                          minutes)
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
                <Typography variant="title">Picks Under 10 seconds</Typography>
              </Toolbar>
              <div style={{ height: "30vh", overflow: "auto" }}>
                <Table aria-labelledby="tableTitle" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Driver</TableCell>
                      <TableCell>Number Of Picks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.underTen.map((row, idx) => (
                      <TableRow
                        hover
                        onClick={event =>
                          this.props.onDriverSelected(event, row)
                        }
                        key={idx}>
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
    return !this.state.options.series ? (
      Options
    ) : (
      <Grid container style={{ height: "80vh" }}>
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
