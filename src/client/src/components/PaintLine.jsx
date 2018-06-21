import React, { Component } from 'react';
import * as classnames from 'classnames';


var LINE_COLUMNS = [
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

export class PaintLine extends React.Component {
  constructor(props,context){
    super(props,context);

    this.state={
      // env: this.props.route.env,
      env:'production',
      scheduleRows: [],
      paintLineRows: [],
      current: {},
    };
  }
  
  componentWillMount(){
    this.autoRefresh();
  }
  componentWillUnmount(){
    clearTimeout(this.refresh);
    this.refresh = null;
  }
  autoRefresh(){
     
    var request = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();
        
    debugger;
    var url="api/paint/GetPaintSchSnapshot" ;
    // var url = this.state.env == "production" ? : "api/paint/GetPaintSchSnapshotTest";
    
    request.open('GET', "api/paint/GetPaintLineSnapshot", true);
    //request.setRequestHeader('Content-Type', 'application/json; charest=utf-8');
    request.setRequestHeader('Content-Type', 'application//x-www-form-urlencoded; charset=UTF-8');
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {

        // var data = JSON.parse(request.response);
        // //var arr = JSON.parse(data.d);
        //   var arr = data;
        // var current = arr[0];
        // this.setState({
        //   paintLineRows: arr,
        //   current: current
        // });
      } 
      };

    //request.send(JSON.stringify({}));
    request.send();

    request2.open('POST', url, true);
    request2.setRequestHeader('Content-Type', 'application/json; charest=utf-8');
    request2.onload = () => {
      if (request2.status >= 200 && request2.status < 400) {
        var data = JSON.parse(request2.response).d;
        //var arr = JSON.parse(data);
          var arr = data;

        this.setState({scheduleRows: arr});
      } else {
        console.log('error');
      }
    };
    request2.send(JSON.stringify({}))
    this.refresh = setTimeout(this.autoRefresh, 5 * 1000);
  }
  render(){
    return(
      <div>
        <div>
        </div>
        <div>
          <table className='table table-bordered table-striped'>
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
              {
                this.state.scheduleRows.map((rowData, rowIdx) => {
                  return (
                    <tr className={getRowStyle(rowData['cr_count'], rowData['total_crs'], rowData['round_position'], this.state.current.latest)}>
                      {
                        SCH_COLUMNS.map((columnMetaData, colIdx) => {
                          if(colIdx == 0) return (<td>{rowData[columnMetaData.key]}</td>)
                          else return (<td>{rowData[columnMetaData.key]}</td>)
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

function getColorStyle(color, cr_count){
    return classnames({
      'paint-color-blue': color.toLowerCase().includes('blue') && cr_count != '',
      'paint-color-red': color.toLowerCase().includes('red') && cr_count != '',
      'paint-color-green': color.toLowerCase().includes('green') && cr_count != '',
      'paint-color-yellow': color.toLowerCase().includes('yellow') && cr_count != '',
      'paint-color-purple': color.toLowerCase().includes('purple') && cr_count != '',
      'paint-color-orange': color.toLowerCase().includes('orange') && cr_count != '',
      'paint-color-black': color.toLowerCase().includes('black') && cr_count != '',
      'paint-color-white': color.toLowerCase().includes('white') && cr_count != '',
      'paint-color-grey' : color.toLowerCase().includes('gray') || color.toLowerCase().includes('granite') && cr_count != ''
    });
}

function getRowStyle(cr_count, total_crs, round_position, current_position){
  return classnames({
    'scheduled': cr_count != '',
    'unscheduled': cr_count == '',
    'pending': cr_count != total_crs && parseInt(round_position) == parseInt(current_position),
    'exception': cr_count != total_crs && parseInt(round_position) < parseInt(current_position)
  });
} 
