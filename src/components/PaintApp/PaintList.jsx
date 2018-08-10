/**
 * PaintList.
 *
 * Renders Items for Paint Load App.
 *
 * @since 7-25-2018
 *
 * @class PaintList
 */

// ReSharper disable InconsistentNaming
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import HammerRow from './HammerRow';
import update from 'immutability-helper';
import UserIcon from '../UserIcon';
import { UserPropType } from '../../shared/sharedTypes';
import PaintColumns from './PaintColumns';
import PaintListTop from './PaintListTop';
import ScrollableTable from '../ScrollableTable';
// ReSharper restore InconsistentNaming

import {
  Fetch,
  options,
  URLS,
  SocketActions,
  AVAILABLE,
  ASSIST,
  OsOptions,
  PRODUCTION,
  STAGE,
  WATCH,
  LOAD
} from '../../shared';
import io from 'socket.io-client';

const convertDataItem = (item) => {
  return {
    id: item[0],
    master_id: item[1],
    round: item[2],
    round_position: item[3],
    program: item[4],
    notes: item[5],
    color: item[6],
    mold_skin_style: item[7],
    rework_color_chart: item[8],
    quantity: item[9],
    loc: item[10],
    staged_by: item[11],
    handled_by: item[12],
    grab_by: item[13],
    date_staged: item[14],
    date_handled: item[15],
    date_grabbed: item[16]
  };
};
const IsAvailable = (items) => items.every((item) => item === AVAILABLE);

const IsSame = (a, b) => {
  const keys = Object.keys(a).concat(Object.keys(b));
  const same = keys.every((key) => a[key] === b[key]);

  return same;
};
/**
 * Gets Formatted Date for Queries
 * @param {Date} date
 */
const GetFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const result = `${year}-${month}-${day}`;
  return result;
};

const sortFn = (a, b) => {
  const roundA = parseInt(a.round, 10);
  const posA = parseInt(a.round_position, 10);
  const roundB = parseInt(b.round, 10);
  const posB = parseInt(b.round_position, 10);
  const qtyA = parseInt(a.quantity, 10);
  const qtyB = parseInt(b.quantity, 10);

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

/**
 * @class PaintList
 */
// ReSharper disable once InconsistentNaming
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
    this.newRow = this.newRow.bind(this);
  }

  /**
   *
   */
  componentDidMount() {
    const { role, currentUser } = this.props;
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

    const DEV = 'http://nord:5555/paint-load';
    const PRO = 'http://normagnaapps1:5555/paint-load';
    const path = this.env === PRODUCTION ? DEV : PRO;

    this.socket = io(path);

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

    this.socket.on(SocketActions.Login, (msg) => {
      const alert = <UserIcon user={msg} forAlert={true} />;
      this.props.alert.show(alert);
    });

    this.socket.emit(SocketActions.Login, currentUser);
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
   * performHardUpdate
   */
  performHardUpdate() {
    const { role } = this.props;
    let url = URLS.GetPaintPickList;

    if (role === STAGE) url = URLS.GetPaintStageList;
    if (role === LOAD || role === WATCH) url = URLS.GetPaintLoadList;

    Fetch(url, this.env)
      .then(this.updateData)
      .catch(Fetch.HandleError);

    Fetch(URLS.GetPaintRevise, this.env)
      .then((data) => this.setState({ currentRevision: data[0].revision_name }))
      .catch(Fetch.ErrorHandler);
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
    this.socket.emit(SocketActions.RowUpdate, data[rowIdx]);
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
   * @param {PaintRowItem} item
   * @param {Number} rowIdx
   */
  handleRelease(item, rowIdx) {
    const { currentUser } = this.props;

    let available = {
      grab_by: AVAILABLE,
      handled_by: AVAILABLE,
      staged_by: AVAILABLE
    };

    item = update(item, { $merge: available });

    let query = { id: item.id, pickedBy: currentUser.id };
    const o = options(query);

    Fetch(URLS.ReleaseRow, this.env, o)
      .then((d) => {
        if (d.value > 0) {
          this.releaseSuccess(item, rowIdx);
        } else {
          this.performHardUpdate();
        }
      })
      .catch(Fetch.ErrorHandler);
  }

  /**
   * Updates State data
   * @param {Number} index
   * @param {Object} item
   */
  updateItems(index, item) {
    let data = update(this.state.data, { [index]: { $merge: item } });
    this.setState({ data: data });
  }

  /**
   *
   * @param {*} item
   * @param {*} rowIdx
   */
  releaseSuccess(item, rowIdx) {
    this.emit(SocketActions.RowUpdate, item);
    this.updateItems(rowIdx, item);
  }
  emit(action, data) {
    this.socket.emit(action, data);
  }
  stage(data, rowIdx) {
    const { currentUser } = this.props;

    let newdata = data;

    this.updateItems(rowIdx, { staged_by: currentUser.id });

    const eventDate = GetFormattedDate(new Date());
    const req = {
      id: data.id,
      pickedBy: currentUser.id,

      itemDate: eventDate
    };
    const d = options(req);
    Fetch(URLS.StageRow, this.env, d)
      .then((o) => {
        if (o.value > 0) {
          this.stageSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      })
      .catch((o) => {
        debugger;
      });
  }

  stageSuccess(newData, rowIdx) {
    const data = update(this.state.data, { $splice: [[rowIdx, 1]] });
    this.setState({
      data: data
    });
    this.emit(SocketActions.RowUpdate, newData);
  }

  finalize(data) {
    const query = { id: data[0], pickedBy: this.state.currentUser.id };
    const url = 'FinalizeRow';
    debugger;
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
    const { role } = this.props;

    let rowUpdated = false;

    // Check to see if item needs to be converted
    if (Array.isArray(newData)) {
      newData = convertDataItem(newData);
    }
    let data = update(this.state.data, { $push: [] });

    const idx = data.findIndex(
      (o) => o.id === newData.id && o.master_id === newData.master_id
    );

    if (idx === -1 && false) {
      this.removeRow(newData);
      return;
      //TODO Need to check to see if this is a new item
    }

    // rowUpdated = !IsSame(newData, data[idx]);
    if (!rowUpdated) {
    } else {
      this.updateItems(idx, newData);

      return;
    }

    switch (role) {
      case LOAD:
        let data = update(this.state.data, { $push: [] }).map((row) => {
          if (row.id === newData.id) {
            rowUpdated = true;
            return row;
          }
          return row;
        });
        // Test this
        if (rowUpdated) {
          this.setState({ data: data });
        } else {
          this.newRow(newData);
        }

        break;
      case STAGE:
        break;
      default:
        const { staged_by, handled_by } = newData;
        if (!IsAvailable([staged_by, handled_by])) {
          this.removeRow(newData);
        } else {
          if (rowUpdated) {
            this.setState({ data: data });
          } else {
            this.newRow(newData);
          }
        }
        break;
    }
  }

  removeRow(row) {
    let data = update(this.state.data, { $push: [] });
    let idx = data.findIndex((o) => o.id === row.id);

    if (idx === -1) {
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

  UndoActionHandler(rowIdx, item) {
    const { data } = this.state;
    const { currentUser, role } = this.props;
    // let data=update(this.props.data,{$push:[]});

    let row = update(data[rowIdx], { $merge: item });

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
    const { role, OSName } = this.props;
    const { data } = this.state;

    let row = update(data[rowIdx], {});

    const { staged_by, handled_by, grab_by } = row;

    // Check to see if its my row

    const IsWindowsLabel =
      OSName === OsOptions.Windows && tapTarget.classList.contains('label');
    const isMine = row.grab_by === AVAILABLE;
    switch (role) {
      case ASSIST:
        if (isMine) {
          this.checkOut(row, rowIdx);
        } else {
          if (isMine && IsWindowsLabel) {
            this.checkIn(row, rowIdx);
          }
        }
        break;
      case STAGE:
        if (
          ![staged_by, handled_by, grab_by].every((o) => o === AVAILABLE) &&
          IsWindowsLabel
        ) {
          this.stage(row, rowIdx);
        }
        break;
      case LOAD:
        if (
          row.staged_by !== AVAILABLE &&
          row.handled_by !== AVAILABLE &&
          IsWindowsLabel
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
    const { role, currentUser } = this.props;
    const { currentRoundNumber, data, currentRevision } = this.state;
    const label = role === LOAD ? 'Load' : role === STAGE ? 'Staging' : 'Pick';
    const title = `Paint ${label} List`;

    const visibleColumns = PaintColumns.filter((o) => o.visible);
    return (
      <Fragment>
        <PaintListTop
          title={title}
          currentRoundNumber={currentRoundNumber}
          currentRevision={currentRevision}
          currentUser={currentUser}
        />
        <ScrollableTable hover condensed>
          <thead>
            <tr>
              {visibleColumns.map((o) => (
                <th key={`th-${o.key}`} style={o.style} className={o.className}>
                  {o.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, rowIdx) => (
              <HammerRow
                role={role}
                key={rowData.id}
                rowId={rowIdx}
                rowData={rowData}
                UndoActionHandler={this.UndoActionHandler}
                TapActionHandler={this.TapActionHandler}
                SwipeActionHandler={this.SwipeActionHandler}
                currentUser={currentUser}>
                {visibleColumns.map((columnMetaData, colIdx) => {
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
        </ScrollableTable>
      </Fragment>
    );
  }
}

PaintList.propTypes = {
  OSName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  currentUser: UserPropType,
  route: PropTypes.shape({
    env: PropTypes.string,
    path: PropTypes.string,
    component: PropTypes.any
  })
};
