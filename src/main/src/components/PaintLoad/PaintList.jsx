import React, { Component } from 'react';
import * as update from 'react-addons-update';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableRow, TableCell, TextField, Input, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import HammerComponent from './HammerComponent';
import classNames from 'classnames';

import UndoCell from './UndoCell';
import DataService from '../../api/DataService';

import SocketScheduler from './SocketScheduler';

import ListTop from './ListTop';
import Columns from './Columns';
import sortFn from './sortFunction';
import {
  REFRESH_RATE,
  OS,
  AVAILABLE,
  ConnectionStates,
  ASSIST,
  STAGE,
  LOAD
} from '../../Constants';

const getTagType = (classname) => {
  const result = /((?:undo|description|color|mold_skin_style|rework_color_chart|quantity|picked_by|staged_by))/i.exec(
    classname
  );
  if(result)
    return result[0];

  return null;
};

const styles = () =>({
  
  root:{

  },
  selected: {

  },
  hover:{

  },
  head: {

  },
  footer: {

  }
})


class PaintList extends Component {
  constructor(props) {
    super(props);
    this.undocellRef = React.createRef();
    this.getUndoCell = this.getUndoCell.bind(this);
    this.UndoActionHandler = this.UndoActionHandler.bind(this);
    this.TapActionHandler = this.TapActionHandler.bind(this);
    this.autoRefresh = this.autoRefresh.bind(this);
    this.updateData = this.updateData.bind(this);
    this._os = OS.getOSVersion();
    this.handleTap = this.handleTap.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.state = {
      data: [],
      connectionState: ConnectionStates.Disconnected, 
      currentRevision: '',
      currentRoundNumber: ''
    };
  }

  getUndoCell(cell, row) {
    const { role, currentUser } = this.props;
    return (
      <UndoCell
        role={role}
        rowData={row}
        currentUser={currentUser}
      />
    );
  }


  updateData() {
    const { role } = this.props;

    let func;
    switch (role) {
      case ASSIST:
      func=DataService.GetPaintLoadInfo('GetPaintPickList');
        
        break;
      case STAGE:
        func = 'GetPaintStageList';
        break;
      case LOAD:
        func = 'GetPaintLoad';
        break;
      case 'watch':
        break;6
      default:
        break;
    }
    func
    .then((result) => {
      this.setState({
        currentRoundNumber: result.currentRoundNumber,
        data: result.data
      });
    })
    .catch((error) => {
      debugger;
    });
  }

  componentDidMount() {
     this.updateData();

    const connected = SocketScheduler.isConnected;

    console.log(`Connection state is ${connected}`);
    const { handleConnectionStateChanged } = this.props;
    handleConnectionStateChanged(connected);
    this.setState({
      connectionState: connected
        ? ConnectionStates.Connected
        : ConnectionStates.Disconnected
    });
    this.refresh = setTimeout(this.autoRefresh, REFRESH_RATE * 1000);
    SocketScheduler.subscribe(ConnectionStates.RowUpdate, this.updateRow);
    SocketScheduler.subscribe(ConnectionStates.RowDelete, this.updateRow);
    SocketScheduler.subscribe(ConnectionStates.NewRow, this.updateRow);
    SocketScheduler.subscribe(ConnectionStates.Update, (msg) => {
      debugger;
    });
    SocketScheduler.subscribe(ConnectionStates.UpdateNotify, () => {
      setTimeout(this.performHardUpdate, 0);
    });

    SocketScheduler.subscribe(ConnectionStates.Disconnect, () => {
      console.log(ConnectionStates.Disconnected);
      this.setState({ connectionState: ConnectionStates.Disconnected });
      handleConnectionStateChanged(ConnectionStates.Disconnected);
    });
    SocketScheduler.subscribe(ConnectionStates.Reconnect, () => {
      console.log(ConnectionStates.Reconnect);
      this.setState({ connectionState: ConnectionStates.Reconnected });
      handleConnectionStateChanged(ConnectionStates.Connected);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.refresh);
  }

  /**
   * @description Performs hard update of data
   */
  performHardUpdate() {
    this.updateData();
  }

  autoRefresh() {
    this.performHardUpdate();
    this.refresh = setTimeout(this.autoRefresh, REFRESH_RATE * 1000);
  }

  checkOut(data, rowIdx) {
    const { currentUser, environment } = this.props;

   
    let url="CheckOutRow";
    const newdata = data;
    newdata.picked_by = currentUser.name;
    // let query = { id: parseInt(data[0],10), pickedBy: this.state.currentUser.id }
    const query = `id=${parseInt(data.id,10)}&pickedBy=${currentUser.id}`;
    const eventDate= new Date();
    const body = {
      id:parseInt(data.id,10),
      pickedBy:currentUser.id,
      checkOutDate:eventDate.toISOString()
    };

    DataService.CheckOutRow(body)
      .then(result=>{
        
       
        // let res = JSON.parse(msg.d);
        if (result && result.value > 0) {
          this.checkOutSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      
      })
      .catch(o=>{
        debugger;
      })
 
  }

  checkOutSuccess(newData, rowIdx) {
    const { data } = this.state;
    const updatedData = update(data, { $push: [] });
    updatedData[rowIdx] = newData;
    this.setState({
      data:updatedData
    });
    this.socket.emit(ConnectionStates.RowUpdate, newData);
  }

  checkIn(data, rowIdx) {
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();
    const { currentUser , environment} = this.props;
    newdata[newdata.length - 2] = currentUser.name;
    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    // const query ="id=" + parseInt(data[0], 10) + "&pickedBy=" + this.state.currentUser.id;

    if (environment === 'production') {
      url = 'api/paint/CheckInRow';
    } else {
      url = 'api/paint/CheckInRowTest';
    }

    request.open('POST', url, true);
    // request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        // let responseData = JSON.parse(res.d);
        if (res.value > 0) {
          this.checkInSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      }
    };
    // request.send(JSON.stringify(query));
    request.send();
  }

  checkInSuccess(newData, rowIdx) {
    const { data } = this.state;
    const dd = update(data, { $splice: [[rowIdx, 1]] });

    if (
      Object.prototype.toString.call(dd) === '[object Array]'
      && Object.prototype.toString.call(dd[0]) === '[object Array]'
      && dd[0].length > 2
    ) {
      this.setState({
        data: dd,
        currentRoundNumber: dd[0][2]
      });
    } else {
      this.setState({ data: dd });
    }
    this.socket.emit(ConnectionStates.RowUpdate, newData);
  }

  release(data, rowIdx) {
    const { currentUser , environment }= this.props;
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();

    newdata[newdata.length - 3] = AVAILABLE;
    newdata[newdata.length - 2] = AVAILABLE;
    newdata[newdata.length - 1] = AVAILABLE;
    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query =  `id=${parseInt(data[0],10)}&pickedBy=${currentUser.id}`;

    if (environment === 'production') {
      url = 'api/paint/ReleaseRow';
    } else {
      url = 'api/paint/ReleaseRowTest';
    }

    request.open('POST', url, true);
    // request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        // let responseData = JSON.parse(res.d);
        if (res.value > 0) {
          this.releaseSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      }
    };
    // request.send(JSON.stringify(query));
    request.send(query);
  }

  releaseSuccess(newData, rowIdx) {
    const { data } = this.state;

    const updateData = update(data, { $push: [] });
    updateData[rowIdx] = newData;
    this.setState({
      data:updateData
    });
    this.socket.emit(ConnectionStates.RowUpdate, newData);
  }

  stage(data, rowIdx) {
    const { currentUser, environment} = this.props;
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();

    // set Staged-By to current User
    newdata[newdata.length - 3] = currentUser.name;

    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query = `id=${parseInt(data[0],10)}&pickedBy=${currentUser.id}`; 

    if ( environment === 'production') {
      url = 'api/paint/StageRow';
    } else {
      url = 'api/paint/StageRowTest';
    }

    request.open('POST', url, true);
    // request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        // let responseData = JSON.parse(res.d);
        if (res.value > 0) {
          this.stageSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      }
    };
    // request.send(JSON.stringify(query));
    request.send(query);
  }

  stageSuccess(newData, rowIdx) {
    const { data } = this.state;
    const updateData = update(data, { $splice: [[rowIdx, 1]] });
    this.setState({
      data:updateData
    });
    this.socket.emit(ConnectionStates.RowUpdate, newData);
  }

  finalize(data) {
    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const { currentUser, environment } = this.props;
    const query = `id=${parseInt(data[0],10)}&pickedBy=${currentUser.id}`;  
    let url;
    const request = new XMLHttpRequest();

    if (environment === 'production') {
      url = 'api/paint/FinalizeRow';
    } else {
      url = 'api/paint/FinalizeRowTest';
    }

    request.open('POST', url, true);
    // request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        const responseData = JSON.parse(res.d);
        if (responseData.value > 0) {
          debugger;
          //   this.finalizeSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      } else {
      }
    };
    // request.send(JSON.stringify(query));
    request.send(query);
  }

  finalizeSuccess(data) {

    this.removeRow(data);
    this.socket.emit('rowdelete', data);
    const dd = this.state.data.slice();
    if (
      Object.prototype.toString.call(dd) === '[object Array]'
      && Object.prototype.toString.call(dd[0]) === '[object Array]'
      && dd[0].length > 2
    ) {
      this.setState({ currentRoundNumber: dd[0][2] });
    }
  }

  updatePartialQty(amnt, data) {
    const { currentUser, environment } = this.props;
    let url;
    const currentRowData = data.slice();
    const updatedRowData = data.slice();
    const newRowData = data.slice();
    newRowData[0] = '0';

    let newQty = 0;
    const updateAmt = parseInt(amnt, 10);
    newQty = currentRowData[9] - updateAmt;

    if (newQty < 0) newQty = 0;

    updatedRowData[9] = updateAmt.toString();
    newRowData[9] = newQty.toString();
    newRowData[newRowData.length - 1] = AVAILABLE;

    const query = {
      id: currentRowData[0],
      master_id: currentRowData[1],
      pickedBy: currentUser.id,
      amnt: updateAmt,
      newAmnt: newQty
    };

    if ( environment === 'production') {url = "api/paint/updatePartialQty";}
    else url = 'api/paint/updatePartialQtyTest';

    const request = new XMLHttpRequest();

    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        const responseData = JSON.parse(res.d);
        console.log(responseData);
        if (responseData.numChanged > 0) {
          this.updatePartialQtySuccess(
            updatedRowData,
            newRowData,
            responseData
          );
        } else {
          this.performHardUpdate();
        }
      }
    };
    request.send(JSON.stringify(query));
  }

  updatePartialQtySuccess(updatedRowData, newRowData, res) {
    this.updateRow(updatedRowData);
    this.socket.emit(ConnectionStates.RowUpdate, updatedRowData);
    if (parseInt(res.newId, 10) > 1 && parseInt(newRowData[9], 10) > 0) {
      newRowData[0] = res.newId.toString();
      this.newRow(newRowData);
      this.socket.emit('newrow', newRowData);
    }
  }

  updateRow(newData, rowIdx) {
    let rowUpdated = false;
    const { role } = this.props;
    const { data } = this.state;
    let udata=[];
    if (role === LOAD) {
      udata= update(data, { $push: [] });
      const temp = udata.map(rowData=> {
        if (rowData[0] === newData[0]) {
          rowUpdated = true;
          return newData;
        } 
          return rowData;
        
      });
      udata = temp;
      if (rowUpdated) {
        this.setState({ data: udata });
      }
    } else if (role === STAGE) {
        if (
          newData[newData.length - 1] !== AVAILABLE &&
          newData[newData.length - 2] !== AVAILABLE &&
          newData[newData.length - 3] !== AVAILABLE
        ) {
          this.removeRow(newData);
        } else {
          udata = update(data, { $push: [] });
          const temp = udata.map(function(rowData, idx) {
            if (rowData[0] === newData[0]) {
              rowUpdated = true;
              return newData;
            } else {
              return rowData;
            }
          });
          udata = temp;
          if (rowUpdated) {
            this.setState({ data: udata });
          } else {
            this.newRow(newData);
          }
        }
      } else {
        if (
          newData[newData.length - 1] !== AVAILABLE &&
          newData[newData.length - 2] !== AVAILABLE
        ) {
          this.removeRow(newData);
        } else {
         udata = update(this.state.data, { $push: [] });
          const temp = udata.map(function(rowData, idx) {
            if (rowData[0] === newData[0]) {
              rowUpdated = true;
              return newData;
            } else {
              return rowData;
            }
          });
          udata = temp;
          if (rowUpdated) {
            this.setState({ data: udata });
          } else {
            this.newRow(newData);
          }
        }
      }
  }

  removeRow(row) {
    let idx = -1;
    const { data } = this.state;
    let udata = update(data, { $push: [] });
    data.map((rowData, rowIdx) => {
      debugger;
      if (rowData[0] === row[0]) idx = rowIdx;
    });

    if (idx > -1) {
      udata = update(data, { $splice: [[idx, 1]] });
      this.setState({ data:udata });
    }
  }

  newRow(newData) {
    let exists = false;
    const { data } = this.state;
    let udata = update(data, { $push: [] });
    debugger;
    udata.map((rowData) => {
      debugger;
      if (rowData[0] === newData[0]) exists = true;
    });

    if (!exists) {
      udata = update(data, { $push: [newData] });
      udata.sort(sortFn);
      this.setState({ data:udata });
    }
  }

  UndoActionHandler(rowIdx) {
    const { data } = this.state;
    const { role, currentUser } = this.props;
    const row = data[rowIdx];
    // const row = update(this.state.data[rowIdx], { $push: [] });

    switch (role) {
      case ASSIST:
        if (
          row.picked_by === currentUser.name
          && role === ASSIST
        ) {
          this.release(row, rowIdx);
        }
        break;
      case STAGE:
        if (row.picked_by !== AVAILABLE && row.handled_by !== AVAILABLE) {
          this.release(row, rowIdx);
        }
        break;
      case LOAD:
        if (row.picked_by !== AVAILABLE && row.handled_by !== AVAILABLE) {
          this.release(row, rowIdx);
        }
        break;

      default:
    }
  }

  TapActionHandler(event, row) {
  
    const { role, currentUser } = this.props;
    const { classList } = event;
    const { data } = this.state;
    const tag = getTagType(event.className);
    // const row = update(this.state.data[rowIdx], { $push: {} });
   const idx = data.indexOf(row);
    switch (role) {
      case ASSIST:
        if (row.picked_by === AVAILABLE) {
          this.checkOut(row, idx);
        } else if (
            row.picked_by === currentUser.name &&
           role === ASSIST &&
            this._os === OS.WINDOWS &&
            classList.contains("label")
          ) {
            this.checkIn(row, idx);
          }
        break;
      case STAGE:
        if (
          row.picked_by !== AVAILABLE
          && row.handled_by !== AVAILABLE
          && row.staged_by !== AVAILABLE
          && this._os === OS.WINDOWS
          && classList.contains('label')
        ) {
          this.stage(row);
        }
        break;
      case LOAD:
        if (
          row.picked_by !== AVAILABLE
          && row.handled_by !== AVAILABLE
          && this._os === OS.WINDOWS
          && classList.contains('label')
        ) {
          this.finalize(row);
        }
        break;
      default:
    }
  }

  SwipeActionHandler(rowIdx) {
    const { data } = this.state;
    const { role, currentUser } = this.props;
    const row = update(data[rowIdx], { $push: [] });

    switch (role) {
      case ASSIST:
        if (
          row.picked_by === currentUser.name
          && role === ASSIST
        ) {
          this.checkIn(row, rowIdx);
        }
        break;
      case STAGE:
        if (row.picked_by !== AVAILABLE && row.handled_by !== AVAILABLE) {
          this.stage(row, rowIdx);
        }
        break;
      case LOAD:
        if (row.picked_by !== AVAILABLE && row.handled_by !== AVAILABLE) {
          this.finalize(row);
        }
        break;
      default:
    }
  }

  onRowClick(row) {
    debugger;
  }

  updateState(result){
    this.setState({
      currentRoundNumber: result.currentRoundNumber,
      data: result.data
    })
  }

  customStyle(cell, row) {
    return {};
  }

  handleSwipe(event){
    debugger;
  }

  handleTap(event){
    debugger;
  }
  handleUndo(event){
    debugger;
  }

  render() {
    const  hidden = { display: 'none' };
    const { data, connectionState, currentRoundNumber, currentRevision } = this.state;
    const { role, environment, currentUser, classes  } = this.props;

   
    return (
      <div>
        {/* <ListTop
          currentRevision={currentRevision}
          currentRoundNumber={`${currentRoundNumber}`}
          environment={environment}
          connectionState={connectionState}
          role={role}
        /> */}
        <Table>
          <TableHead style={{display:'block'}}>
            <TableRow>
              {
                Columns.filter(o=>o.visible)
                  .map((c)=>{return (<TableCell variant='head' key={c.key} >{c.title}</TableCell>)})
              }
            </TableRow>
          </TableHead>
          <TableBody style={{ height: '60vh', overflow: 'auto', display: 'block' }}>
            { data.map((rowData, rowIdx) => {
             const colors = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];
             const color={backgroundColor:colors[parseInt(rowData.round_pos, 10) % colors.length]}
              const rowKey = `paint-${rowIdx}`;
              if (rowIdx < 26) {
                return ( 
                   
                  <TableRow hover className={classNames(classes.row)} key={rowKey} >
                    
                   
                      <UndoCell
                        style={ color}
                        role={role}
                        key={`${rowData.id  }-0`}
                        rowData={rowData}
                        updatePartialQty={this.updatePartialQty}
                        currentUser={currentUser}
                        TapActionHandler={this.TapActionHandler}
                        SwipeActionHandler={this.SwipeActionHandler}
                        UndoActionHandler={this.UndoActionHandler}
                        {...this.props}
                      >
                        {rowData}
                      </UndoCell>
                     

                    {Columns.filter( c =>c.visible)
                      .map((cell, colIdx) => {

                      const value = rowData[cell.data];
                      const key=`${rowData.id}-${colIdx}`;
                      return (
                        <HammerComponent key={key} {...this.props}   
                        rowData={rowData}
                        TapActionHandler={this.TapActionHandler}
                        SwipeActionHandler={this.SwipeActionHandler}
                        UndoActionHandler={this.UndoActionHandler}>
                          {cell.CellRenderer && <cell.CellRenderer className={classNames(classes.body)}  role={role} rowData={rowData} updatePartialQty={this.updatePartialQty} currentUser={currentUser}>{value}</cell.CellRenderer>}
                          {!cell.CellRenderer && <div  className={classNames(classes.body,cell.className )}><Typography  >  {value}</Typography></div>}
                        </HammerComponent>
                      )
                         
                    })}
                  </TableRow>
                
                );
              }
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

PaintList.propTypes = { 
  handleConnectionStateChanged:PropTypes.func.isRequired,
  env: PropTypes.string,
  currentUser: PropTypes.shape({
    name:PropTypes.string,
    id:PropTypes.any,
    img:PropTypes.string,
    imgPath: PropTypes.string
  }).isRequired,
  role: PropTypes.string,
  environment: PropTypes.string,
  OSName: PropTypes.string
};

export default withStyles(styles)(PaintList);