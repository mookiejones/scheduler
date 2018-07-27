import * as Highcharts from 'highcharts';
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
