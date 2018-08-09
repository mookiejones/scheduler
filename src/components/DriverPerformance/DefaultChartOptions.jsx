import * as Highcharts from 'highcharts';

export const chartOptions = {
  chart: {
    types: [
      { name: 'line', enabled: true },
      { name: 'spline', enabled: true },
      { name: 'column', enabled: true },
      { name: 'bar', enabled: true },
      { name: 'area', enabled: true },
      { name: 'areaspline', enabled: true },
      { name: 'pie', enabled: true },
      { name: 'arearange', enabled: true },
      { name: 'areasplinerange', enabled: true },
      { name: 'boxplot', enabled: true },
      { name: 'bubble', enabled: true },
      { name: 'columnrange', enabled: true },
      { name: 'errorbar', enabled: true },
      { name: 'funnel', enabled: true },
      { name: 'gauge', enabled: true },
      { name: 'heatmap', enabled: true },
      { name: 'polygon', enabled: true },
      { name: 'pyramid', enabled: true },
      { name: 'scatter', enabled: true },
      { name: 'solidgauge', enabled: true },
      { name: 'treemap', enabled: true },
      { name: 'waterfall', enabled: true }
    ]
  }
};
const defaultChartOptions = {
  chart: {
    type: 'scatter',
    zoomType: 'xy'
  },
  credits: {
    enabled: false
  },
  title: {
    text: 'Driver Averages by Day'
  },
  xAxis: {
    allowDecimals: false,
    title: {
      scalable: false
    },
    type: 'datetime' //,
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
    backgroundColor:
      (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
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
export default defaultChartOptions;
