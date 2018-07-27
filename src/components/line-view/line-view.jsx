import React, { Component } from 'react';
import classnames from 'classnames';
import Fetch from '../../DataFetcher';

// eslint-disable-next-line
const LINE_COLUMNS = [
  {
    key: 'datetimestamp',
    title: 'Date',
    style: {}
  },
  {
    key: 'recnum',
    title: 'Record Number',
    style: {}
  },
  {
    key: 'stylenum',
    title: 'Style Number',
    style: {}
  },
  {
    key: 'carriernum',
    title: 'Carrier Number',
    style: {}
  },
  {
    key: 'line_pos',
    title: 'Line Position',
    style: {}
  }
];
var SCH_COLUMNS = [
  {
    key: 'round_position',
    title: 'Line Position',
    style: {}
  },
  {
    key: 'style_code',
    title: 'Style_code',
    style: {}
  },
  {
    key: 'cr_count',
    title: 'Carrier Carriers',
    style: {}
  },
  {
    key: 'total_crs',
    title: 'Total Carriers',
    style: {}
  },
  {
    key: 'program',
    title: 'Program',
    style: {}
  },
  {
    key: 'mold_skin_style',
    title: 'Mold Skin Style',
    style: {}
  },
  {
    key: 'color',
    title: 'Color',
    style: {}
  }
];

class LineView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      env: this.props.route.env,
      scheduleRows: [],
      paintLineRows: [],
      current: {}
    };
  }

  componentWillMount() {
    this.autoRefresh();
  }
  componentWillUnmount() {
    clearTimeout(this.refresh);
    this.refresh = null;
  }
  autoRefresh() {
    var request = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();
    const url = 'GetPaintSchSnapshot';
    const {
      route: { env }
    } = this.props;
    Fetch(url, env)
      .then((data) => {
        debugger;
        var arr = JSON.parse(data.d);
        var current = arr[0];
        this.setState({
          paintLineRows: arr,
          current: current
        });
      })
      .catch((error) => {
        debugger;
      });

    Fetch('GetPaintLineSnapshot', env)
      .then((data) => {
        this.setState({ scheduleRows: data });
      })
      .catch((error) => {
        debugger;
      });

    this.refresh = setTimeout(this.autoRefresh, 5 * 1000);
  }
  render() {
    return (
      <div>
        <div />
        <div>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>round_position</th>
                <th>style_code</th>
                <th>cr_cnt</th>
                <th>total_crs</th>
                <th>program</th>
                <th>mold_skin_style</th>
                <th>color</th>
              </tr>
            </thead>
            <tbody>
              {this.state.scheduleRows.map((rowData, rowIdx) => {
                return (
                  <tr
                    className={getRowStyle(
                      rowData['cr_count'],
                      rowData['total_crs'],
                      rowData['round_position'],
                      this.state.current.latest
                    )}>
                    {SCH_COLUMNS.map((columnMetaData, colIdx) => {
                      if (colIdx === 0)
                        return <td>{rowData[columnMetaData.key]}</td>;
                      else return <td>{rowData[columnMetaData.key]}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function getColorStyle(color, cr_count) {
  let value = cr_count !== '';
  return classnames({
    'paint-color-blue': /blue/i.test(color) && value,
    'paint-color-red': /red/i.test(color) && value,
    'paint-color-green': /green/i.test(color) && value,
    'paint-color-yellow': /yellow/i.test(color) && value,
    'paint-color-purple': /purple/i.test(color) && value,
    'paint-color-orange': /orange/i.test(color) && value,
    'paint-color-black': /black/i.test(color) && value,
    'paint-color-white': /white/i.test(color) && value,
    'paint-color-grey': /(?:grey|granite)/i.test(color) && value
  });
}

function getRowStyle(cr_count, total_crs, round_position, current_position) {
  return classnames({
    scheduled: cr_count !== '',
    unscheduled: cr_count === '',
    pending:
      cr_count !== total_crs &&
      parseInt(round_position, 10) === parseInt(current_position, 10),
    exception:
      cr_count !== total_crs &&
      parseInt(round_position, 10) < parseInt(current_position, 10)
  });
}
export default LineView;
