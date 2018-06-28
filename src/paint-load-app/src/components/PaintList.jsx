import React, { Component } from "react";
import * as update from "react-addons-update";
import PropTypes from "prop-types";
import UndoCell from "./UndoCell";
import { ListGroup, ListGroupItem, Col } from "react-bootstrap";
import DataService from "../api/DataService";
import SocketScheduler from "./SocketScheduler";
import PaintItem from "./PaintItem";
import * as hammer from "hammerjs";
import ListTop from "./ListTop";

const sortFn = (a, b) => {
  const roundA = parseInt(a[2], 10);
  const posA = parseInt(a[3], 10);
  const roundB = parseInt(b[2], 10);
  const posB = parseInt(b[3], 10);
  const qtyA = parseInt(a[9], 10);
  const qtyB = parseInt(b[9], 10);

  if (roundA === roundB) {
    // if round is the same, sort by round_position
    if (posA === posB) {
      if (qtyA < qtyB) {
        return -1;
      } else if (qtyA > qtyB) {
        return 1;
      }
      return 0;
    }
    return posA < posB ? -1 : 1;
  }
  return roundA < roundB ? -1 : 1;
};

const UndoField = (column, attr, editorClass, ignoreEditable) => {
  debugger;
  return <div />;
};

export default class PaintList extends Component {
  constructor(props, context) {
    super(props, context);
    this.undocellRef = React.createRef();
    this.getUndoCell = this.getUndoCell.bind(this);
    this.state = {
      data: [],
      currentUser: props.currentUser,
      env: props.environment,
      currentRevision: "",
      currentRoundNumber: "",
    };
  }
  getUndoCell(cell, row) {
    return (
      <UndoCell
        role={this.props.role}
        rowData={row}
        currentUser={this.props.currentUser}
      />
    );
  }
  componentDidMount() {
    let func;
    switch (this.props.role) {
      case "assist":
        func = "GetPaintPickList";
        break;
      case "stage":
        func = "GetPaintStageList";
        break;
      case "load":
        func = "GetPaintLoad";
        break;
      case "watch":
        break;
      default:
        break;
    }
    DataService.GetPaintInfo(func)
      .then(result => {
        this.setState({
          currentRoundNumber: result.currentRoundNumber,
          data: result.data,
        });
      })
      .catch(error => {
        debugger;
      });

    this.refresh = setTimeout(this.autoRefresh, 35 * 1000);
    SocketScheduler.subscribe("rowupdate", this.updateRow);
    SocketScheduler.subscribe("rowdelete", this.updateRow);
    SocketScheduler.subscribe("newrow", this.updateRow);
    SocketScheduler.subscribe("update-notify", msg => {
      setTimeout(this.performHardUpdate, 0);
    });

    SocketScheduler.subscribe("disconnect", () => {
      console.log("disconnected");
    });
    SocketScheduler.subscribe("reconnect", () => {
      console.log("reconnected");
    });
  }
  componentWillUnmount() {
    clearTimeout(this.refresh);
  }

  performHardUpdate() {
    let url = "api/paint/GetPaintPickList";
    const request = new XMLHttpRequest();
    const request2 = new XMLHttpRequest();

    if (this.props.environment === "production") {
      if (this.props.role === "stage") url = "api/paint/GetPaintStageList";
      if (this.props.role === "load" || this.props.role === "watch")
        url = "api/paint/GetPaintLoadList";
    } else {
      url = "api/paint/GetPaintPickListTest";
      if (this.props.role === "stage") url = "api/paint/GetPaintStageListTest";
      if (this.props.role === "load" || this.props.role === "watch")
        url = "api/paint/GetPaintLoadListTest";
    }

    request.open("GET", url, true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.response);
        const arr = data; //JSON.parse(data.d);

        const srtdData = arr.sort(sortFn);
        if (
          Object.prototype.toString.call(srtdData) === "[object Array]" &&
          Object.prototype.toString.call(srtdData[0]) === "[object Array]" &&
          srtdData[0].length > 2
        ) {
          this.setState({
            data: srtdData,
            currentRoundNumber: srtdData[0][2],
          });
        } else {
          this.setState({ data: srtdData });
        }
      } else {
      }
    };
    //request.send(JSON.stringify({}));
    request.send();

    request2.open("GET", "api/paint/getPntRevise", true);
    request2.setRequestHeader(
      "Content-Type",
      "application/json; charest=utf-8",
    );
    request2.onload = () => {
      if (request2.status >= 200 && request2.status < 400) {
        //let data = JSON.parse(request2.response).d;
        const data = request2.response;
        this.setState({ currentRevision: data });
      } else {
        console.log("error");
      }
    };
    request2.send();
  }
  autoRefresh() {
    //   this.performHardUpdate();
    //   this.refresh = setTimeout(this.autoRefresh, 31 * 1000);
  }
  checkOut(data, rowIdx) {
    let url;
    const newdata = data;
    newdata[newdata.length - 1] = this.state.currentUser.name;
    //let query = { id: parseInt(data[0],10), pickedBy: this.state.currentUser.id }
    const query =
      "id=" + parseInt(data[0], 10) + "&pickedBy=" + this.state.currentUser.id;

    if (this.props.environment === "production") {
      url = "api/paint/CheckOutRow";
    } else {
      url = "api/paint/CheckOutRowTest";
    }

    const request = new XMLHttpRequest();

    request.open("POST", url, true);
    //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8",
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const msg = JSON.parse(request.response);
        //let res = JSON.parse(msg.d);
        if (msg.value > 0) {
          this.checkOutSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      } else {
      }
    };
    //request.send(JSON.stringify(query));
    request.send(query);
  }
  checkOutSuccess(newData, rowIdx) {
    const data = update(this.state.data, { $push: [] });
    data[rowIdx] = newData;
    this.setState({
      data: data,
    });
    this.socket.emit("rowupdate", newData);
  }
  checkIn(data, rowIdx) {
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();
    newdata[newdata.length - 2] = this.state.currentUser.name;
    //let query = { id: data[0], pickedBy: this.state.currentUser.id }
    // const query ="id=" + parseInt(data[0], 10) + "&pickedBy=" + this.state.currentUser.id;

    if (this.props.environment === "production") {
      url = "api/paint/CheckInRow";
    } else {
      url = "api/paint/CheckInRowTest";
    }

    request.open("POST", url, true);
    //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8",
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        //let responseData = JSON.parse(res.d);
        if (res.value > 0) {
          this.checkInSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      }
    };
    //request.send(JSON.stringify(query));
    request.send();
  }
  checkInSuccess(newData, rowIdx) {
    const dd = update(this.state.data, { $splice: [[rowIdx, 1]] });

    if (
      Object.prototype.toString.call(dd) === "[object Array]" &&
      Object.prototype.toString.call(dd[0]) === "[object Array]" &&
      dd[0].length > 2
    ) {
      this.setState({
        data: dd,
        currentRoundNumber: dd[0][2],
      });
    } else {
      this.setState({ data: dd });
    }
    this.socket.emit("rowupdate", newData);
  }
  release(data, rowIdx) {
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();

    newdata[newdata.length - 3] = "##AVAILABLE##";
    newdata[newdata.length - 2] = "##AVAILABLE##";
    newdata[newdata.length - 1] = "##AVAILABLE##";
    //let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query =
      "id=" + parseInt(data[0], 10) + "&pickedBy=" + this.state.currentUser.id;

    if (this.props.environment === "production") {
      url = "api/paint/ReleaseRow";
    } else {
      url = "api/paint/ReleaseRowTest";
    }

    request.open("POST", url, true);
    //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8",
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        //let responseData = JSON.parse(res.d);
        if (res.value > 0) {
          this.releaseSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      }
    };
    //request.send(JSON.stringify(query));
    request.send(query);
  }
  releaseSuccess(newData, rowIdx) {
    const data = update(this.state.data, { $push: [] });
    data[rowIdx] = newData;
    this.setState({
      data: data,
    });
    this.socket.emit("rowupdate", newData);
  }
  stage(data, rowIdx) {
    let url;
    const newdata = data;
    const request = new XMLHttpRequest();

    //set Staged-By to current User
    newdata[newdata.length - 3] = this.state.currentUser.name;

    //let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query =
      "id=" + parseInt(data[0], 10) + "&pickedBy=" + this.state.currentUser.id;

    if (this.props.environment === "production") {
      url = "api/paint/StageRow";
    } else {
      url = "api/paint/StageRowTest";
    }

    request.open("POST", url, true);
    //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8",
    );
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        //let responseData = JSON.parse(res.d);
        if (res.value > 0) {
          this.stageSuccess(newdata, rowIdx);
        } else {
          this.performHardUpdate();
        }
      }
    };
    //request.send(JSON.stringify(query));
    request.send(query);
  }
  stageSuccess(newData, rowIdx) {
    const data = update(this.state.data, { $splice: [[rowIdx, 1]] });
    this.setState({
      data: data,
    });
    this.socket.emit("rowupdate", newData);
  }
  finalize(data) {
    //let query = { id: data[0], pickedBy: this.state.currentUser.id }
    const query =
      "id=" + parseInt(data[0], 10) + "&pickedBy=" + this.state.currentUser.id;
    let url;
    const request = new XMLHttpRequest();

    if (this.props.environment === "production") {
      url = "api/paint/FinalizeRow";
    } else {
      url = "api/paint/FinalizeRowTest";
    }

    request.open("POST", url, true);
    //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8",
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
    //request.send(JSON.stringify(query));
    request.send(query);
  }
  finalizeSuccess(data) {
    this.removeRow(data);
    this.socket.emit("rowdelete", data);
    const dd = this.state.data.slice();
    if (
      Object.prototype.toString.call(dd) === "[object Array]" &&
      Object.prototype.toString.call(dd[0]) === "[object Array]" &&
      dd[0].length > 2
    ) {
      this.setState({ currentRoundNumber: dd[0][2] });
    }
  }
  updatePartialQty(amnt, data) {
    let url;
    const currentRowData = data.slice();
    const updatedRowData = data.slice();
    const newRowData = data.slice();
    newRowData[0] = "0";

    let newQty = 0;
    const updateAmt = parseInt(amnt, 10);
    newQty = currentRowData[9] - updateAmt;

    if (newQty < 0) newQty = 0;

    updatedRowData[9] = updateAmt.toString();
    newRowData[9] = newQty.toString();
    newRowData[newRowData.length - 1] = "##AVAILABLE##";

    const query = {
      id: currentRowData[0],
      master_id: currentRowData[1],
      pickedBy: this.state.currentUser.id,
      amnt: updateAmt,
      newAmnt: newQty,
    };

    if (this.props.environment === "production")
      url = "api/paint/updatePartialQty";
    else url = "api/paint/updatePartialQtyTest";

    const request = new XMLHttpRequest();

    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const res = JSON.parse(request.response);
        const responseData = JSON.parse(res.d);
        console.log(responseData);
        if (responseData.numChanged > 0) {
          this.updatePartialQtySuccess(
            updatedRowData,
            newRowData,
            responseData,
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
    this.socket.emit("rowupdate", updatedRowData);
    if (parseInt(res.newId, 10) > 1 && parseInt(newRowData[9], 10) > 0) {
      newRowData[0] = res.newId.toString();
      this.newRow(newRowData);
      this.socket.emit("newrow", newRowData);
    }
  }
  updateRow(newData, rowIdx) {
    let rowUpdated = false;
    if (this.props.role === "load") {
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
      }
    } else {
      if (this.props.role === "stage") {
        if (
          newData[newData.length - 1] !== "##AVAILABLE##" &&
          newData[newData.length - 2] !== "##AVAILABLE##" &&
          newData[newData.length - 3] !== "##AVAILABLE##"
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
          newData[newData.length - 1] !== "##AVAILABLE##" &&
          newData[newData.length - 2] !== "##AVAILABLE##"
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
  }
  removeRow(row) {
    let idx = -1;
    let data = update(this.state.data, { $push: [] });
    data.map(function(rowData, rowIdx) {
      debugger;
      if (rowData[0] === row[0]) idx = rowIdx;
    });

    if (idx > -1) {
      data = update(this.state.data, { $splice: [[idx, 1]] });
      this.setState({ data: data });
    }
  }
  newRow(newData) {
    let exists = false;
    let data = update(this.state.data, { $push: [] });
    data.map((rowData, rowIdx) => {
      debugger;
      if (rowData[0] === newData[0]) exists = true;
    });

    if (!exists) {
      data = update(this.state.data, { $push: [newData] });
      data.sort(sortFn);
      this.setState({ data: data });
    }
  }
  UndoActionHandler(rowIdx) {
    const row = update(this.state.data[rowIdx], { $push: [] });

    switch (this.props.role) {
      case "assist":
        if (
          row[row.length - 1] === this.state.currentUser.name &&
          this.props.role === "assist"
        ) {
          this.release(row, rowIdx);
        }
        break;
      case "stage":
        if (
          row[row.length - 1] !== "##AVAILABLE##" &&
          row[row.length - 2] !== "##AVAILABLE##"
        ) {
          this.release(row, rowIdx);
        }
        break;
      case "load":
        if (
          row[row.length - 1] !== "##AVAILABLE##" &&
          row[row.length - 2] !== "##AVAILABLE##"
        ) {
          this.release(row, rowIdx);
        }
        break;

      default:
    }
  }
  TapActionHandler(rowIdx, tapTarget) {
    const row = update(this.state.data[rowIdx], { $push: [] });
    switch (this.props.role) {
      case "assist":
        if (row[row.length - 1] === "##AVAILABLE##") {
          this.checkOut(row, rowIdx);
        } else {
          if (
            row[row.length - 1] === this.state.currentUser.name &&
            this.props.role === "assist" &&
            this.props.OSName === "Windows" &&
            tapTarget.classList.contains("label")
          ) {
            this.checkIn(row, rowIdx);
          }
        }
        break;
      case "stage":
        if (
          row[row.length - 1] !== "##AVAILABLE##" &&
          row[row.length - 2] !== "##AVAILABLE##" &&
          row[row.length - 3] !== "##AVAILABLE##" &&
          this.props.OSName === "Windows" &&
          tapTarget.classList.contains("label")
        ) {
          this.stage(row);
        }
        break;
      case "load":
        if (
          row[row.length - 1] !== "##AVAILABLE##" &&
          row[row.length - 2] !== "##AVAILABLE##" &&
          this.props.OSName === "Windows" &&
          tapTarget.classList.contains("label")
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
      case "assist":
        if (
          row[row.length - 1] === this.state.currentUser.name &&
          this.props.role === "assist"
        ) {
          this.checkIn(row, rowIdx);
        }
        break;
      case "stage":
        if (
          row[row.length - 1] !== "##AVAILABLE##" &&
          row[row.length - 2] !== "##AVAILABLE##"
        ) {
          this.stage(row, rowIdx);
        }
        break;
      case "load":
        if (
          row[row.length - 1] !== "##AVAILABLE##" &&
          row[row.length - 2] !== "##AVAILABLE##"
        ) {
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
    var hidden = { display: "none" };
    const options = {};
    const props = this.props;
    const keyBoardNav = {
      customStyle: this.customStyle,
    };
    const styles = {
      root: {
        padding: "0 30px",
      },
      slide: {
        padding: 15,
        minHeight: 100,
        color: "#fff",
      },
      slideContainer: {
        padding: "0 10px",
      },
      slide1: {
        backgroundColor: "#FEA900",
      },
      slide2: {
        backgroundColor: "#B3DC4A",
      },
      slide3: {
        backgroundColor: "#6AC0FF",
      },
    };

    return (
      <div>
        <ListTop
          currentRevision={this.state.currentRevision}
          currentRoundNumber={this.state.currentRoundNumber}
          environment={this.props.environment}
          role={this.props.role}
        />
        <ListGroup>
          {this.state.data.map((rowData, rowIdx) => (
            <PaintItem
              key={rowIdx}
              data={rowData}
              role={this.props.role}
              currentUser={this.props.currentUser}
              environment={this.props.environment}
            />
          ))}
        </ListGroup>

        {/* <table className="table table=bordered">
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
              <th className="action" style={{ width: "70px" }} />
              <th style={hidden}>Handled By</th>
              <th>Picked By</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((rowData, rowIdx) => {
              if (rowIdx < 26) {
                return (
                  <HammerRow
                    role={this.props.role}
                    key={rowData.id}
                    rowId={rowIdx}
                    rowData={rowData}
                    UndoActionHandler={this.UndoActionHandler}
                    TapActionHandler={this.TapActionHandler}
                    SwipeActionHandler={this.SwipeActionHandler}
                    currentUser={this.state.currentUser}>
                    {Columns.map((cell, colIdx) => {
                      if (cell.visible !== false) {
                        if (cell.CellRenderer)
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
                        else
                          return (
                            <td
                              className={cell.className ? cell.className : ""}
                              key={rowData.id + "-" + colIdx}>
                              {rowData[cell.data]}
                            </td>
                          );
                      }
                    })}
                  </HammerRow>
                );
              }
            })}
          </tbody>
        </table> */}
      </div>
    );
  }
}

PaintList.propTypes = {
  env: PropTypes.string,
  currentUser: PropTypes.any,
  role: PropTypes.string,
  environment: PropTypes.string,
  OSName: PropTypes.string,
};
