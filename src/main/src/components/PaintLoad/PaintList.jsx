import React, { Component } from 'react';
import * as update from 'react-addons-update';
import PropTypes from 'prop-types';
import { Table } from "react-bootstrap";
import UndoCell from "./UndoCell";
import DataService from '../../api/DataService';

import SocketScheduler from './SocketScheduler';
import TableRow from './TableRow';
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
  return result[0];
};

export default class PaintList extends Component {
  constructor(props, context) {
    super(props, context);
    this.undocellRef = React.createRef();
    this.getUndoCell = this.getUndoCell.bind(this);
    this.UndoActionHandler = this.UndoActionHandler.bind(this);
    this.TapActionHandler = this.TapActionHandler.bind(this);
    this.autoRefresh = this.autoRefresh.bind(this);
    this._os = OS.getOSVersion();

    this.state = {
      data: [],
      connectionState: ConnectionStates.Disconnected,
      currentUser: props.currentUser,
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

  componentDidMount() {
    const { role, connectionStateChanged } = this.props;
    let func;
    switch (role) {
      case ASSIST:
        func = 'GetPaintPickList';
        break;
      case STAGE:
        func = 'GetPaintStageList';
        break;
      case LOAD:
        func = 'GetPaintLoad';
        break;
      case 'watch':
        break;
      default:
        break;
    }
    DataService[func]()   
      .then((result) => {
        this.setState({
          currentRoundNumber: result.currentRoundNumber,
          data: result.data
        });
      })
      .catch((error) => {
        debugger;
      });

    const connected = SocketScheduler.isConnected;
    console.log(`Connection state is ${connected}`);

  connectionStateChanged(connected);
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
    SocketScheduler.subscribe(ConnectionStates.UpdateNotify, (msg) => {
      setTimeout(this.performHardUpdate, 0);
    });

    SocketScheduler.subscribe(ConnectionStates.Disconnect, () => {
      console.log(ConnectionStates.Disconnected);
      this.setState({ connectionState: ConnectionStates.Disconnected });
      connectionStateChanged(ConnectionStates.Disconnected);
    });
    SocketScheduler.subscribe(ConnectionStates.Reconnect, () => {
      console.log(ConnectionStates.Reconnect);
      this.setState({ connectionState: ConnectionStates.Reconnected });
      this.props.connectionStateChanged(ConnectionStates.Connected);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.refresh);
  }

  /**
   * @description Performs hard update of data
   */
  performHardUpdate() {
    let cmd = 'GetPaintPickList';
    switch (this.props.role) {
      case STAGE:
        cmd = 'GetPaintStageList';
        break;
      case LOAD:
      case 'watch':
        cmd = 'GetPaintLoadList';
        break;
        default:
        throw new Error('Need to get value for ' + this.props.role);
    }
    if (this.props.environment !== 'production') {
      // cmd += "Test";
    }
    DataService.GetPaintInfo(cmd)
      .then((result) => {
        this.setState({
          data: result.data,
          currentRoundNumber: result.currentRoundNumber
        });
      })
      .catch((err) => {
        debugger;
      });

    // DataService.GetPaintInfo(
    //   this.props.environment !== "production"
    //     ? "getPntReviseTest"
    //     : "getPntRevise"
    // )
    //   .then((result) => {
    //     debugger;
    //   })
    //   .catch((err) => {
    //     debugger;
    //   });
  }

  autoRefresh() {
    this.performHardUpdate();
    this.refresh = setTimeout(this.autoRefresh, REFRESH_RATE * 1000);
  }

  checkOut(data, rowIdx) {
    debugger;
    let url;
    const newdata = data;
    newdata[newdata.length - 1] = this.state.currentUser.name;
    // let query = { id: parseInt(data[0],10), pickedBy: this.state.currentUser.id }
    const query =      'id=' + parseInt(data[0], 10) + '&pickedBy=' + this.state.currentUser.id;

    if (this.props.environment === 'production') {
      url = 'api/paint/CheckOutRow';
    } else {
      url = 'api/paint/CheckOutRowTest';
    }

    const request = new XMLHttpRequest();

    request.open('POST', url, true);
    // request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const msg = JSON.parse(request.response);
        // let res = JSON.parse(msg.d);
        if (msg.value > 0) {
          this.checkOutSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      } else {
      }
    };
    // request.send(JSON.stringify(query));
    request.send(query);
  }

  checkOutSuccess(newData, rowIdx) {
    const data = update(this.state.data, { $push: [] });
    data[rowIdx] = newData;
    this.setState({
      data
    });
    this.socket.emit(ConnectionStates.RowUpdate, newData);
  }

  checkIn(data, rowIdx) {
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();
    newdata[newdata.length - 2] = this.state.currentUser.name;
    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    // const query ="id=" + parseInt(data[0], 10) + "&pickedBy=" + this.state.currentUser.id;

    if (this.props.environment === 'production') {
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
    const dd = update(this.state.data, { $splice: [[rowIdx, 1]] });

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
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();

    newdata[newdata.length - 3] = AVAILABLE;
    newdata[newdata.length - 2] = AVAILABLE;
    newdata[newdata.length - 1] = AVAILABLE;
    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query =      'id=' + parseInt(data[0], 10) + '&pickedBy=' + this.state.currentUser.id;

    if (this.props.environment === 'production') {
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
    const data = update(this.state.data, { $push: [] });
    data[rowIdx] = newData;
    this.setState({
      data
    });
    this.socket.emit(ConnectionStates.RowUpdate, newData);
  }

  stage(data, rowIdx) {
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();

    // set Staged-By to current User
    newdata[newdata.length - 3] = this.state.currentUser.name;

    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query =      'id=' + parseInt(data[0], 10) + '&pickedBy=' + this.state.currentUser.id;

    if (this.props.environment === 'production') {
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
    const data = update(this.state.data, { $splice: [[rowIdx, 1]] });
    this.setState({
      data
    });
    this.socket.emit(ConnectionStates.RowUpdate, newData);
  }

  finalize(data) {
    // let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query =      'id=' + parseInt(data[0], 10) + '&pickedBy=' + this.state.currentUser.id;
    let url;
    const request = new XMLHttpRequest();

    if (this.props.environment === 'production') {
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
      pickedBy: this.state.currentUser.id,
      amnt: updateAmt,
      newAmnt: newQty
    };

    if (this.props.environment === 'production') {url = "api/paint/updatePartialQty";}
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
    if (this.props.role === LOAD) {
      let data = update(this.state.data, { $push: [] });
      const temp = data.map(function(rowData, idx) {
        if (rowData[0] === newData[0]) {
          rowUpdated = true;
          return newData;
        } 
          return rowData;
        
      });
      data = temp;
      if (rowUpdated) {
        this.setState({ data });
      }
    } else if (this.props.role === STAGE) {
        if (
          newData[newData.length - 1] !== AVAILABLE &&
          newData[newData.length - 2] !== AVAILABLE &&
          newData[newData.length - 3] !== AVAILABLE
        ) {
          this.removeRow(newData);
        } else {
          let data = update(this.state.data, { $push: [] });
          const temp = data.map(function(rowData, idx) {
            if (rowData[0] === newData[0]) {
              rowUpdated = true;
              return newData;
            } else {
              return rowData;
            }
          });
          data = temp;
          if (rowUpdated) {
            this.setState({ data: data });
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
          let data = update(this.state.data, { $push: [] });
          const temp = data.map(function(rowData, idx) {
            if (rowData[0] === newData[0]) {
              rowUpdated = true;
              return newData;
            } else {
              return rowData;
            }
          });
          data = temp;
          if (rowUpdated) {
            this.setState({ data: data });
          } else {
            this.newRow(newData);
          }
        }
      }
  }

  removeRow(row) {
    let idx = -1;
    let data = update(this.state.data, { $push: [] });
    data.map((rowData, rowIdx) => {
      debugger;
      if (rowData[0] === row[0]) idx = rowIdx;
    });

    if (idx > -1) {
      data = update(this.state.data, { $splice: [[idx, 1]] });
      this.setState({ data });
    }
  }

  newRow(newData) {
    let exists = false;
    let data = update(this.state.data, { $push: [] });
    debugger;
    data.map((rowData, rowIdx) => {
      debugger;
      if (rowData[0] === newData[0]) exists = true;
    });

    if (!exists) {
      data = update(this.state.data, { $push: [newData] });
      data.sort(sortFn);
      this.setState({ data });
    }
  }

  UndoActionHandler(rowIdx) {
    const row = this.state.data[rowIdx];
    // const row = update(this.state.data[rowIdx], { $push: [] });

    switch (this.props.role) {
      case ASSIST:
        if (
          row.picked_by === this.state.currentUser.name
          && this.props.role === ASSIST
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

  TapActionHandler(rowIdx, tapTarget) {
    debugger;
    const tag = getTagType(tapTarget.className);
    // const row = update(this.state.data[rowIdx], { $push: {} });
    const row = this.state.data[rowIdx];
    switch (this.props.role) {
      case ASSIST:
        if (row.picked_by === AVAILABLE) {
          this.checkOut(row, rowIdx);
        } else if (
            row.picked_by === this.state.currentUser.name &&
            this.props.role === ASSIST &&
            this._os === OS.WINDOWS &&
            tapTarget.classList.contains("label")
          ) {
            this.checkIn(row, rowIdx);
          }
        break;
      case STAGE:
        if (
          row.picked_by !== AVAILABLE
          && row.handled_by !== AVAILABLE
          && row.staged_by !== AVAILABLE
          && this._os === OS.WINDOWS
          && tapTarget.classList.contains('label')
        ) {
          this.stage(row);
        }
        break;
      case LOAD:
        if (
          row.picked_by !== AVAILABLE
          && row.handled_by !== AVAILABLE
          && this._os === OS.WINDOWS
          && tapTarget.classList.contains('label')
        ) {
          this.finalize(row);
        }
        break;
      default:
    }
  }

  SwipeActionHandler(rowIdx) {
    const row = update(this.state.data[rowIdx], { $push: [] });

    switch (this.props.role) {
      case ASSIST:
        if (
          row.picked_by === this.state.currentUser.name
          && this.props.role === ASSIST
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

  customStyle(cell, row) {
    return {};
  }

  render() {
    let hidden = { display: 'none' };

    return (
      <div>
        <ListTop
          currentRevision={this.state.currentRevision}
          currentRoundNumber={this.state.currentRoundNumber}
          environment={this.props.environment}
          connectionState={this.state.connectionState}
          role={this.props.role}
        />
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th className='undo' />
              <th style={hidden}>master_id </th>
              <th style={hidden}>round</th>
              <th style={hidden}>round_position</th>
              <th>Description</th>
              <th>Color</th>
              <th>Mold Skin Style</th>
              <th>Rework Color Chart</th>
              <th>Quantity</th>
              <th className='action' style={{ width: '70px' }} />
              <th style={hidden}>Handled By</th>
              <th>Picked By</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((rowData, rowIdx) => {
              if (rowIdx < 26) {
                return (
                  <TableRow
                    key={rowIdx}
                    data={rowData}
                    role={this.props.role}
                    rowId={rowIdx}
                    currentUser={this.props.currentUser}
                    UndoActionHandler={this.UndoActionHandler}
                    TapActionHandler={this.TapActionHandler}
                    SwipeActionHandler={this.SwipeActionHandler}
                  >
                    <td>
                      <UndoCell
                        children={this.props.children}
                        role={this.props.role}
                        key={`${rowData.id  }-0`}
                        rowData={rowData}
                        updatePartialQty={this.updatePartialQty}
                        currentUser={this.state.currentUser}
                      >
                        {rowData}
                      </UndoCell>
                    </td>

                    {Columns.map((cell, colIdx) => {
                      if (cell.visible !== false) {
                        if (cell.CellRenderer) {
                          return (
                            <cell.CellRenderer
                              children={this.props.children}
                              role={this.props.role}
                              key={rowData.id + "-" + colIdx}
                              rowData={rowData}
                              updatePartialQty={this.updatePartialQty}
                              currentUser={this.state.currentUser}>
                              {rowData[cell.data]}
                            </cell.CellRenderer>
                          );
                        } 
                          return (
                            <td
                              className={cell.className ? cell.className : ""}
                              key={rowData.id + "-" + colIdx}>
                              {rowData[cell.data]}
                            </td>
                          );
                        
                      }
                    })}
                  </TableRow>
                );
              }
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

PaintList.propTypes = {
  connectionStateChanged: PropTypes.func,
  env: PropTypes.string,
  currentUser: PropTypes.any,
  role: PropTypes.string,
  environment: PropTypes.string,
  OSName: PropTypes.string
};
