/**
 * PaintList.
 *
 * Renders Items for Paint Load App.
 *
 * @since 7-25-2018
 *
 * @class PaintList
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HammerRow from './HammerRow';
import RackOwner from './RackOwner';
import Calculator from './Calculator';
import UndoCell from './UndoCell';
import Description from './Description';
import update from 'immutability-helper';

import {
  Fetch,
  options,
  URLS,
  SocketActions,
  AVAILABLE,
  ASSIST,
  PRODUCTION,
  STAGE,
  WATCH,
  LOAD,
  UNDO_KEY,
  ROUND_KEY
} from '../../shared';
import io from 'socket.io-client';

/**
 * Gets Formatted Date for Queries
 * @param {Date} date
 */
const GetFormattedDate = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  const result = `${year}-${month}-${day}`;
  return result;
};

const sortFn = (a, b) => {
  let roundA = parseInt(a.round, 10);
  let posA = parseInt(a.round_position, 10);
  let roundB = parseInt(b.round, 10);
  let posB = parseInt(b.round_position, 10);
  let qtyA = parseInt(a.quantity, 10);
  let qtyB = parseInt(b.quantity, 10);

  if (roundA === roundB) {
    //if round is the same, sort by round_position
    if (posA === posB) {
      return qtyA < qtyB ? -1 : qtyA > qtyB ? 1 : 0;
    } else {
      return posA < posB ? -1 : 1;
      //return (posA < posB) ? -1 : (posA > posB) ? 1 : 0;
    }
  } else {
    return roundA < roundB ? -1 : 1;
  }
};

const COLUMN_DEFINITIONS = [
  {
    title: '',
    key: 'id',
    data: 0,
    className: UNDO_KEY,
    orderable: false,
    CellRenderer: UndoCell
  },
  {
    key: 'master_id',
    title: 'master_id',
    data: 1,
    visible: false,
    orderable: false
  },
  {
    key: ROUND_KEY,
    title: ROUND_KEY,
    data: 2,
    visible: false,
    orderable: true
  },
  {
    key: 'round_position',
    title: 'round pos',
    data: 3,
    visible: false,
    orderable: true
  },
  {
    key: 'program',
    title: 'Description',
    data: 4,
    className: 'tap',
    orderable: false,
    CellRenderer: Description
  },
  { title: 'notes', key: 'notes', data: 5, visible: false, orderable: false },
  { title: 'Color', key: 'color', data: 6, className: 'tap', orderable: false },
  {
    title: 'Mold Skin Style',
    key: 'mold_skin_style',
    data: 7,
    className: 'tap',
    orderable: false
  },
  {
    title: 'Rework Color Chart',
    key: 'rework_color_chart',
    data: 8,
    className: 'tap',
    orderable: false
  },
  {
    title: 'Quantity',
    key: 'quantity',
    data: 9,
    className: 'tap',
    orderable: false
  },
  {
    title: '',
    data: null,
    className: 'action',
    orderable: false,
    visible: true,
    CellRenderer: Calculator
  },
  { data: 10, visible: false, key: 'loc' },
  {
    title: 'StagedBy',
    data: 11,
    visible: false,
    className: 'tap',
    orderable: false,
    key: 'staged_by'
  },
  {
    title: 'handledBy',
    data: 12,
    visible: false,
    className: 'tap',
    orderable: false,
    key: 'handled_by'
  },
  {
    title: 'Picked By',
    data: 13,
    className: 'pickedBy tap',
    orderable: false,
    visible: true,
    CellRenderer: RackOwner,
    key: 'grab_by'
  }
];

/**
 * @class PaintList
 */
export default class PaintList extends PureComponent {
  constructor(props) {
    super(props);
    this.env = props.env;
    this.state = {
      data: [],
      currentRevision: '',
      currentRoundNumber: ''
    };
    this.onRelease = this.onRelease.bind(this);
    this.updateData = this.updateData.bind(this);

    this.performHardUpdate = this.performHardUpdate.bind(this);
    this.TapActionHandler = this.TapActionHandler.bind(this);
    this.SwipeActionHandler = this.SwipeActionHandler.bind(this);
    this.UndoActionHandler = this.UndoActionHandler.bind(this);
    this.autoRefresh = this.autoRefresh.bind(this);
    this.updateRow = this.updateRow.bind(this);
  }

  /**
   *
   * @param {*} result
   */
  updateData(result) {
    const srtdData = result.sort(sortFn);

    if (Object.prototype.toString.call(srtdData) === '[object Array]') {
      this.setState({
        data: srtdData,
        currentRoundNumber: srtdData[0].round
      });
    } else {
      this.setState({ data: srtdData });
    }
  }

  /**
   *
   */
  componentDidMount() {
    const { role } = this.props;
    let url = URLS.GetPaintPickList;
    switch (role) {
      case STAGE:
        url = URLS.GetPaintStageList;
        break;
      case WATCH:
      case LOAD:
        url = URLS.GetPaintLoadList;
        break;
      default:
        break;
    }

    Fetch(url, this.env)
      .then(this.updateData)
      .catch(Fetch.HandleError);

    Fetch(URLS.GetPaintRevise, this.env)
      .then((data) => this.setState({ currentRevision: data[0].revision_name }))
      .catch(Fetch.HandleError);

    this.refresh = setTimeout(this.autoRefresh, 35 * 1000);

    const path =
      this.env === PRODUCTION
        ? 'http://normagnaapps1:5555/paint-load'
        : 'http://nord:5555/paint-load';

    this.socket = io(path);
    this.socket.on('connected', (client) => {
      debugger;
    });

    this.socket.on(SocketActions.RowUpdate, this.updateRow);
    this.socket.on(SocketActions.RowDelete, this.removeRow);
    this.socket.on(SocketActions.NewRow, this.newRow);
    this.socket.on(SocketActions.UpdateNotify, () => {
      setTimeout(this.performHardUpdate(), 0);
    });
    this.socket.on(SocketActions.Disconnect, () => {
      console.warn('disconnected');
    });
    this.socket.on(SocketActions.Reconnect, () => {
      console.warn('connected');
    });
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    clearTimeout(this.refresh);
  }

  /**
   * autoRefresh
   */
  autoRefresh() {
    this.performHardUpdate();
    this.refresh = setTimeout(this.autoRefresh, 31 * 1000);
  }

  /**
   * performHardUpdate
   */
  performHardUpdate() {
    const { role } = this.props;
    let url = URLS.GetPaintPickList;

    if (this.env === PRODUCTION) {
      if (role === STAGE) url = URLS.GetPaintStageList;
      if (role === LOAD || role === WATCH) url = URLS.GetPaintLoadList;
    }

    Fetch(url, this.env)
      .then((data) => {
        const srtdData = data.sort(sortFn);
        if (Object.prototype.toString.call(srtdData) === '[object Array]') {
          this.setState({
            data: srtdData,
            currentRoundNumber: srtdData[0].round
          });
        } else {
          this.setState({ data: srtdData });
        }
      })
      .catch(Fetch.HandleError);

    Fetch(URLS.GetPaintRevise, this.env)
      .then((data) => {
        this.setState({ currentRevision: data[0].revision_name });
      })
      .catch((error) => {
        debugger;
      });
  }

  /**
   * Check out row
   * @param {*} data
   * @param {*} rowIdx
   */
  checkOut(data, rowIdx) {
    const { currentUser } = this.props;

    let newdata = data;
    newdata.grab_by = currentUser.name;
    const eventDate = GetFormattedDate(new Date());
    let query = options({
      id: parseInt(data.id, 10),
      pickedBy: currentUser.id,
      checkoutDate: eventDate
    });

    Fetch(URLS.CheckOutRow, this.env, query)
      .then((d) => {
        if (d.value > 0) {
          this.checkOutSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      })
      .catch(Fetch.HandleError);
  }

  /**
   * Successfully Checked out Item
   * @param {PaintRowData} newData
   * @param {Number} rowIdx
   */
  checkOutSuccess(newData, rowIdx) {
    let data = update(this.state.data, {});
    data[rowIdx] = newData;
    this.setState(data);
    this.socket.emit(SocketActions.RowUpdate, newData);
  }

  /**
   * Check in item
   * @param {RowData} data
   * @param {Number} rowIdx
   */
  checkIn(data, rowIdx) {
    const { currentUser } = this.props;

    let newdata = data;

    newdata.grab_by = currentUser.name;
    let query = {
      id: data.id,
      pickedBy: currentUser.id,
      checkInDate: GetFormattedDate(new Date())
    };

    Fetch(URLS.CheckInRow, this.env, options(query))
      .then((d) => {
        if (d.value > 0) {
          this.checkInSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      })
      .catch(Fetch.HandleError);

    // request.send(JSON.stringify(query));
  }

  checkInSuccess(newData, rowIdx) {
    let dd = update(this.state.data, { $splice: [[rowIdx, 1]] });

    if (
      Object.prototype.toString.call(dd) === '[object Array]' &&
      Object.prototype.toString.call(dd[0]) === '[object Array]' &&
      dd[0].length > 2
    ) {
      this.setState({
        data: dd,
        currentRoundNumber: dd[0][2]
      });
    } else {
      this.setState({ data: dd });
    }
    this.emit(SocketActions.RowUpdate, newData);
  }

  /**
   *
   * @param {*} data
   * @param {*} newdata
   * @param {*} rowIdx
   */
  onRelease(data, newdata, rowIdx) {
    if (data.value > 0) {
      this.releaseSuccess(newdata, rowIdx);
    } else {
      this.performHardUpdate();
    }
  }

  /**
   * Release Item
   * @param {PaintRowItem} data
   * @param {Number} rowIdx
   */
  handleRelease(data, rowIdx) {
    const { currentUser } = this.props;

    let available = {
      grab_by: AVAILABLE,
      handled_by: AVAILABLE,
      staged_by: AVAILABLE
    };

    data = update(data, { $merge: available });

    let query = { id: data.id, pickedBy: currentUser.id };
    const o = options(query);

    Fetch(URLS.ReleaseRow, this.env, o)
      .then((d) => {
        if (d.value > 0) {
          this.releaseSuccess(data, rowIdx);
        } else {
          this.performHardUpdate();
        }
      })
      .catch(Fetch.ErrorHandler);
  }

  /**
   *
   * @param {*} item
   * @param {*} rowIdx
   */
  releaseSuccess(item, rowIdx) {
    let data = update(this.state.data, { $push: [] });

    data[rowIdx] = item;

    this.setState({ data });

    this.emit(SocketActions.RowUpdate, item);
  }
  emit(action, data) {
    this.socket.emit(action, data);
  }
  stage(data, rowIdx) {
    debugger;

    let newdata = data;
    let request = new XMLHttpRequest();

    //set Staged-By to current User
    newdata[newdata.length - 3] = this.state.currentUser.name;

    let query = { id: data[0], pickedBy: this.state.currentUser.id };
    debugger;
    request.open('POST', URLS.StageRow, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let res = JSON.parse(request.response);
        let responseData = JSON.parse(res.d);
        if (responseData.value > 0) {
          this.stageSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      } else {
      }
    };
    request.send(JSON.stringify(query));
  }

  stageSuccess(newData, rowIdx) {
    let data = update(this.state.data, { $splice: [[rowIdx, 1]] });
    this.setState({
      data: data
    });
    this.emit(SocketActions.RowUpdate, newData);
  }

  finalize(data) {
    let query = { id: data[0], pickedBy: this.state.currentUser.id };
    let url = 'FinalizeRow';

    Fetch(url, options(query))
      .then((data) => {
        debugger;
      })
      .catch((error) => {
        debugger;
      });
    // let request = new XMLHttpRequest();

    // if (this.props.environment == PRODUCTION) {
    //   url = '../paint.asmx/FinalizeRow';
    // } else {
    //   url = '../paint.asmx/FinalizeRowTest';
    // }

    // request.open('POST', url, true);
    // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // request.onload = () => {
    //   if (request.status >= 200 && request.status < 400) {
    //     let res = JSON.parse(request.response);
    //     let responseData = JSON.parse(res.d);
    //     if (responseData.value > 0) {
    //       this.finalizeSuccess(newdata, rowIdx);
    //     } else {
    //       this.performHardUpdate();
    //     }
    //   } else {
    //   }
    // };
    // request.send(JSON.stringify(query));
  }

  finalizeSuccess(data) {
    this.removeRow(data);
    this.emit(SocketActions.RowDelete, data);
    let dd = this.state.data.slice();
    if (
      Object.prototype.toString.call(dd) === '[object Array]' &&
      Object.prototype.toString.call(dd[0]) === '[object Array]' &&
      dd[0].length > 2
    ) {
      this.setState({ currentRoundNumber: dd[0][2] });
    }
  }

  updatePartialQty(amnt, data) {
    debugger;
    let url;
    let currentRowData = data.slice();
    let updatedRowData = data.slice();
    let newRowData = data.slice();
    newRowData[0] = '0';

    let newQty = 0;
    let updateAmt = parseInt(amnt, 10);
    newQty = currentRowData[9] - updateAmt;

    if (newQty < 0) newQty = 0;

    updatedRowData[9] = updateAmt.toString();
    newRowData[9] = newQty.toString();
    newRowData[newRowData.length - 1] = AVAILABLE;

    let query = {
      id: currentRowData[0],
      master_id: currentRowData[1],
      pickedBy: this.state.currentUser.id,
      amnt: updateAmt,
      newAmnt: newQty
    };
    url = 'updatePartialQty';

    let request = new XMLHttpRequest();

    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let res = JSON.parse(request.response);
        let responseData = JSON.parse(res.d);
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
      } else {
      }
    };
    request.send(JSON.stringify(query));

    /*$.ajax({
          method: "POST",
          url: url,
          data: JSON.stringify(query),
          contentType: "application/json; charest=utf-8",
          dataType: "json",
          success (msg) {
              let res = JSON.parse(msg.d);
              if (res.numChanged > 0) { this.updatePartialQtySuccess(updatedRowData, newRowData, res); }
              else { performHardUpdate(); }
          }.bind(this),
          error (request, status, error) {
              console.log(error);
          }
      });*/
  }

  updatePartialQtySuccess(updatedRowData, newRowData, res) {
    debugger;
    this.updateRow(updatedRowData);
    this.socket.emit(SocketActions.RowUpdate, updatedRowData);
    if (parseInt(res.newId, 10) > 1 && parseInt(newRowData[9], 10) > 0) {
      newRowData[0] = res.newId.toString();
      this.newRow(newRowData);
      this.emit(SocketActions.NewRow, newRowData);
    }
  }

  updateRow(newData) {
    let rowUpdated = false;
    const { role } = this.props;
    const { data } = this.state;
    // Get Index of Item
    const idx = data.findIndex((o) => o.id === newData.id);

    if (idx === -1) throw new Error('Item Doesnt Exist');
    let d = [],
      temp = [];

    switch (role) {
      case LOAD:
        debugger;
        // Test this
        d = update(data, { $push: [] }).map((rowData) => {
          if (rowData[0] === newData[0]) {
            rowUpdated = true;
            return newData;
          } else {
            return rowData;
          }
        });

        d = update(data, { $push: [] });
        temp = data.map(function(rowData) {
          if (rowData[0] === newData[0]) {
            rowUpdated = true;
            return newData;
          } else {
            return rowData;
          }
        });

        d = temp;
        if (rowUpdated) this.setState({ data: d });
        break;
      case STAGE:
        break;
      default:
        if (
          newData.staged_by !== AVAILABLE &&
          newData[newData.handled_by] !== AVAILABLE
        ) {
          this.removeRow(newData);
        } else {
          d = update(data, { $push: [] });
          temp = d.map((rowData) => {
            if (rowData[0] === newData[0]) {
              rowUpdated = true;
              return newData;
            } else {
              return rowData;
            }
          });
          d = temp;
          if (rowUpdated) {
            this.setState({ data: d });
          } else {
            this.newRow(newData);
          }
        }
        break;
    }
    if (role === LOAD) {
      debugger;
      // Test this
      d = update(data, { $push: [] }).map((rowData) => {
        if (rowData[0] === newData[0]) {
          rowUpdated = true;
          return newData;
        } else {
          return rowData;
        }
      });

      d = update(data, { $push: [] });
      temp = data.map(function(rowData) {
        if (rowData[0] === newData[0]) {
          rowUpdated = true;
          return newData;
        } else {
          return rowData;
        }
      });

      d = temp;
      if (rowUpdated) this.setState({ data: d });
    } else {
      debugger;

      if (role === STAGE) {
        if (
          newData.staged_by !== AVAILABLE &&
          newData[newData.length - 2] !== AVAILABLE &&
          newData[newData.length - 3] !== AVAILABLE
        ) {
          this.removeRow(newData);
        } else {
          d = update(data, { $push: [] });
          temp = d.map((rowData) => {
            if (rowData[0] === newData[0]) {
              rowUpdated = true;
              return newData;
            } else {
              return rowData;
            }
          });
          d = temp;
          if (rowUpdated) {
            this.setState({ data: d });
          } else {
            this.newRow(newData);
          }
        }
      } else {
        if (
          newData.staged_by !== AVAILABLE &&
          newData[newData.length - 2] !== AVAILABLE
        ) {
          this.removeRow(newData);
        } else {
          d = update(data, { $push: [] });
          temp = d.map((rowData) => {
            if (rowData[0] === newData[0]) {
              rowUpdated = true;
              return newData;
            } else {
              return rowData;
            }
          });
          d = temp;
          if (rowUpdated) {
            this.setState({ data: d });
          } else {
            this.newRow(newData);
          }
        }
      }
    }
  }

  removeRow(row) {
    let idx = -1;
    debugger;
    let data = update(this.state.data, { $push: [] });
    // eslint-disable-next-line
    data.map(function(rowData, rowIdx) {
      if (rowData[0] === row[0]) idx = rowIdx;
    });

    if (idx > -1) {
      data = update(this.state.data, { $splice: [[idx, 1]] });
      this.setState({ data: data });
    }
  }

  /**
   * Add new row
   * @param {*} newData
   */
  newRow(newData) {
    let exists = false;
    const { data } = this.state;
    let d = update(this.state.data, { $push: [] });
    exists = d.some((rowData) => rowData[0] === newData[0]);

    if (!exists) {
      d = update(data, { $push: [newData] });
      d.sort(sortFn);
      this.setState({ data: d });
    }
  }

  UndoActionHandler(rowIdx) {
    const { data } = this.state;
    const { currentUser } = this.props;

    let row = update(data[rowIdx], { $merge: {} });

    const { role } = this.props;
    let canRelease = false;
    switch (role) {
      case ASSIST:
        canRelease = row.grab_by === currentUser.name;
        break;
      case STAGE:
      case LOAD:
        canRelease =
          row.staged_by !== AVAILABLE && row.handled_by !== AVAILABLE;
        break;

      default:
    }

    if (canRelease) {
      this.handleRelease(row, rowIdx);
    }
  }

  TapActionHandler(rowIdx, tapTarget) {
    const {
      role,
      currentUser: { name },
      OSName
    } = this.props;
    const { data } = this.state;

    let row = update(data[rowIdx], {});
    switch (role) {
      case ASSIST:
        if (row.grab_by === AVAILABLE) {
          this.checkOut(row, rowIdx);
        } else {
          if (
            row.grab_by === name &&
            role === ASSIST &&
            OSName === 'Windows' &&
            tapTarget.classList.contains('label')
          ) {
            this.checkIn(row, rowIdx);
          }
        }
        break;
      case STAGE:
        if (
          row.staged_by !== AVAILABLE &&
          row.handled_by !== AVAILABLE &&
          row.grabbed_by !== AVAILABLE &&
          OSName === 'Windows' &&
          tapTarget.classList.contains('label')
        ) {
          this.stage(row);
        }
        break;
      case LOAD:
        if (
          row.staged_by !== AVAILABLE &&
          row.handled_by !== AVAILABLE &&
          OSName === 'Windows' &&
          tapTarget.classList.contains('label')
        ) {
          this.finalize(row);
        }
        break;
      default:
    }
  }

  SwipeActionHandler(rowIdx) {
    debugger;
    const { data } = this.state;
    const {
      role,
      currentUser: { name }
    } = this.props;
    let row = update(data[rowIdx], {});

    switch (role) {
      case ASSIST:
        if (row.staged_by === name && role === ASSIST)
          this.checkIn(row, rowIdx);

        break;
      case STAGE:
        if (row.staged_by !== AVAILABLE && row.handled_by !== AVAILABLE) {
          this.stage(row, rowIdx);
        }
        break;
      case LOAD:
        if (row.staged_by !== AVAILABLE && row.handled_by !== AVAILABLE) {
          this.finalize(row);
        }
        break;
      default:
    }
  }

  render() {
    const hidden = { display: 'none' };
    const { role, currentUser } = this.props;
    const { currentRoundNumber, data } = this.state;
    const label = role === LOAD ? 'Load' : role === STAGE ? 'Staging' : 'Pick';
    const title = `Paint ${label} List`;

    return (
      <div>
        <div>
          <ul className="nav nav-pills" role="tablist">
            <li role="presentation">
              <h1>{title}</h1>
            </li>
            <li role="presentation" style={{ margin: '30px 15px 0px 15px' }}>
              Current Round <span className="badge">{currentRoundNumber}</span>
            </li>
            <li role="presentation" style={{ margin: '30px 15px 0px 15px' }}>
              Schedule Revision{' '}
              <span className="badge">{currentRoundNumber}</span>
            </li>
            <li style={{ margin: '23px 15px 0px 15px' }}>
              <div className="form-group">
                <input
                  type="checkbox"
                  name="rework-checkbox"
                  id="rework-checkbox"
                  autoComplete="off"
                />
                <div className="btn-group">
                  <label htmlFor="rework-checkbox" className="btn btn-default">
                    <span className="glyphicon glyphicon-ok" />
                    <span>{''}</span>
                  </label>
                  <label
                    htmlFor="rework-checkbox"
                    className="btn btn-default active">
                    Rework Driver
                  </label>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="undo" />
              <th style={hidden}>master_id </th>
              <th style={hidden}>round</th>
              <th style={hidden}>round_position</th>
              <th>Description</th>
              <th>Color</th>
              <th>Mold Skin Style</th>
              <th>Rework Color Chart</th>
              <th>Quantity</th>
              <th className="action" style={{ width: '70px' }} />
              <th style={hidden}>Handled By</th>
              <th>Picked By</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((rowData, rowIdx) => rowIdx < 26)
              .map((rowData, rowIdx) => (
                <HammerRow
                  role={role}
                  key={rowData.id}
                  rowId={rowIdx}
                  rowData={rowData}
                  UndoActionHandler={this.UndoActionHandler}
                  TapActionHandler={this.TapActionHandler}
                  SwipeActionHandler={this.SwipeActionHandler}
                  currentUser={currentUser}>
                  {COLUMN_DEFINITIONS.filter(
                    (columnMetaData) => columnMetaData.visible !== false
                  ).map((columnMetaData, colIdx) => {
                    const value = rowData[columnMetaData.key];

                    if (columnMetaData.CellRenderer)
                      return (
                        <columnMetaData.CellRenderer
                          role={role}
                          key={rowData.id + '-' + colIdx}
                          rowData={rowData}
                          updatePartialQty={this.updatePartialQty}
                          currentUser={currentUser}>
                          {value}
                        </columnMetaData.CellRenderer>
                      );
                    else
                      return (
                        <td
                          className={
                            columnMetaData.className
                              ? columnMetaData.className
                              : ''
                          }
                          key={rowData.id + '-' + colIdx}>
                          {value}
                        </td>
                      );
                  })}
                </HammerRow>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

PaintList.propTypes = {
  OSName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    img: PropTypes.string,
    imgPath: PropTypes.string,
    name: PropTypes.string
  }),
  route: PropTypes.shape({
    env: PropTypes.string,
    path: PropTypes.string,
    component: PropTypes.any
  })
};
