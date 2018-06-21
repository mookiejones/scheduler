// import { Calendar, DateField } from "react-date-picker";
import React, { Component } from "react";
import * as moment from "moment";
import { HC } from "./HC";

// const DateField=()=>(<h1>DateField</h1>);

const Highcharts = require("highcharts");
const update = require("react-addons-update");

function breakIntoSeries(arr, format) {
  const series = [];
  const s = {};
  arr.map((el, idx) => {
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

export default class DriverPerformance extends Component {
  constructor(props, context) {
    super(props, context);
    const now = moment();
    const then = moment().subtract(2, "hours");
    this.state = {
      endTime: now,
      startTime: then,
      defaultOptions: {
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
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || "#FFFFFF"
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
      },
      options: { generated: moment().format("MM/DD/YYYY hh:mm:ss") },
      worsePerformers: [],
      underTen: []
    };
  }

  componentWillMount() {
    this.getDriverAverages();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.startTime !== this.state.startTime || prevState.endTime !== this.state.endTime) {
      this.getDriverAverages();
    }
  }

  getDriverAverages() {
    const request = new XMLHttpRequest();

    const params = {
      startdate: this.state.startTime.format("YYYY-MM-DD HH:mm:ss"),
      enddate: this.state.endTime.format("YYYY-MM-DD HH:mm:ss")
    };

    const url = `api/paint/getDriverAverages?startDate${params[0]}&enddate=${params[1]}`;

    request.open("GET", url, true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.response);

        /* let arr = JSON.parse(data.d); */
        const arr = data;
        const format = "MM/DD/YYYY hh:mm:ss A";

        const average = {
          name: "average",
          type: "spline",
          data: []
        };

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
    };
  }
  getOptions() {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Start Date:</label>
          <br />
          {/* <DateField style={{ marginLeft: "25px" }}
                    dateFormat="MM/DD/YYYY HH:mm:ss"
                    onChange={(dateString, { dateMoment, timestamp }) => {
                        {/* document.activeElement.blur() */}{" "}
          {/*
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
                </DateField> */}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>End Date:</label>
          <br />
          {/* <DateField
            style={{ marginLeft: "25px" }}
            dateFormat="MM/DD/YYYY HH:mm:ss"
            onChange={(dateString, { dateMoment, timestamp }) => {
              // document.activeElement.blur()
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
          </DateField> */}
        </div>
      </div>
    );
  }
  getChart() {
    return (
      <div>
        <div>
          <HC container="chart" key={this.state.options.generated} options={this.state.options} />
        </div>
        <div style={{ display: "flex" }}>
          <div>
            <h2>Slowest Picks</h2>
            <table
              className="table table-bordered table-hover"
              style={{ width: "auto", margin: "10px" }}
            >
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Length (seconds)</th>
                </tr>
              </thead>
              <tbody>
                {this.state.worsePerformers.map((row, idx) => (
                  <tr key={`${row.name}-${idx}`}>
                    <td style={{ width: "250px" }}>{row.full_name}</td>
                    <td style={{ width: "350px" }}>
                      {row.seconds} (~{Math.round((row.seconds / 60) * 100) / 100} minutes)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Picks under 10 Seconds</h2>
            <table className="table table-bordered table-hover" style={{ width: "auto" }}>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Number of Picks</th>
                </tr>
              </thead>
              <tbody>
                {this.state.underTen.map((row, idx) => (
                  <tr key={`${row.full_name}-${idx}-underTen`}>
                    <td style={{ width: "250px" }}>{row.full_name}</td>
                    <td style={{ width: "350px" }}>{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const Options = this.getOptions();
    const Chart = this.getChart();
    console.log(`state: ${this.state}`);
    return !this.state.options.series ? (
      Options
    ) : (
      <div>
        {Options}
        {Chart}
      </div>
    );
  }
}
