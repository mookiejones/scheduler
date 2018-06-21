import React, { Component } from "react";
import * as io from "socket.io-client";
import * as update from "react-addons-update";
import { UndoCell } from "./UndoCell";
import { Description } from "./Description";
import { Calculator } from "./Calculator";
import { RackOwner } from "./RackOwner";
import { HammerRow } from "./HammerRow";
import DataService from "../api/DataService";

const COLUMN_DEFINITIONS = [
    { title: "", data: 0, className: "undo", orderable: false, CellRenderer: UndoCell },
    { title: "master_id", data: 1, visible: false, orderable: false },
    { title: "round", data: 2, visible: false, orderable: true },
    { title: "round pos", data: 3, visible: false, orderable: true },
    { title: "Description", data: 4, className: "tap", orderable: false, CellRenderer: Description },
    { title: "notes", data: 5, visible: false, orderable: false },
    { title: "Color", data: 6, className: "tap", orderable: false },
    { title: "Mold Skin Style", data: 7, className: "tap", orderable: false },
    { title: "Rework Color Chart", data: 8, className: "tap", orderable: false },
    { title: "Quantity", data: 9, className: "tap", orderable: false },
    { title: "", data: null, className: "action", orderable: false, visible: true, CellRenderer: Calculator },
    { data: 10, visible: false },
    { title: "StagedBy", data: 11, visible: false, className: "tap", orderable: false },
    { title: "handledBy", data: 12, visible: false, className: "tap", orderable: false },
    { title: "Picked By", data: 13, className: "pickedBy tap", orderable: false, visible: true, CellRenderer: RackOwner }
];
let sortFn = function(a, b){
    let roundA = parseInt(a[2],10);
    let posA = parseInt(a[3],10);
    let roundB = parseInt(b[2],10);
    let posB = parseInt(b[3],10);
    let qtyA = parseInt(a[9],10);
    let qtyB = parseInt(b[9],10);
  
    if(roundA===roundB){
      //if round is the same, sort by round_position
      if(posA===posB){
        return (qtyA < qtyB) ? -1 : (qtyA > qtyB) ? 1 : 0;
      }else{
        return (posA < posB) ? -1 : 1;
        //return (posA < posB) ? -1 : (posA > posB) ? 1 : 0;
      }
    }else{
      return (roundA < roundB) ? -1 : 1;
    }
  };
  
export default class PaintList extends Component{

  constructor(props,context){
    super(props,context);
    this.state={
      data: [],
      currentUser: props.currentUser,
      env: props.env,
      currentRevision: "",
      currentRoundNumber: "",
    }
  }
    
    componentWillMount(){
 let url;
      let func;
      switch(this.props.role){
        case "assist":
        func=DataService.GetPaintLoadAssist;
        break;
        case "stage":
        break;
        case "load":
        func=DataService.GetPaintLoad;
        break;
        case "watch":
        break;
        default:
        break;
      }

      func()
        .then(r=>{
          debugger;
        })
        .catch(err=>{
          debugger;
        })

        /*
        
          let srtdData = arr.sort(sortFn);
          if(Object.prototype.toString.call(srtdData)==="[object Array]" && Object.prototype.toString.call(srtdData[0])==="[object Array]" && srtdData[0].length > 2) {
            this.setState({
              data: srtdData,
              currentRoundNumber: srtdData[0][2]
            });
            */ 
      this.refresh = setTimeout(this.autoRefresh, 35 * 1000);
  
      if(this.props.environment==="production"){
        this.socket = io("http://normagnaapps1:5555/paint-load");
      }else{
        this.socket = io("http://localhost:5555/paint-load")
      }
  
      this.socket.on("rowupdate", (msg) => {
          this.updateRow(msg);
      });
      this.socket.on("rowdelete", (msg) => {
          this.removeRow(msg);
      })
      this.socket.on("newrow", (msg) => {
          this.newRow(msg);
      });
      this.socket.on("update-notify", (msg) => {
          setTimeout(this.performHardUpdate(), 0);
      });
  
      this.socket.on("disconnect", () => {});
      this.socket.on("reconnect", () => {});
    }
    componentWillUnmount(){
      clearTimeout(this.refresh);
    }
    autoRefresh(){
      this.performHardUpdate();
      this.refresh = setTimeout(this.autoRefresh, 31 * 1000);
    }
    performHardUpdate(){
      let url = "api/paint/GetPaintPickList";
      let request = new XMLHttpRequest();
      let request2 = new XMLHttpRequest();
  
      if(this.props.environment==="production"){
        if(this.props.role==="stage") url = "api/paint/GetPaintStageList";
        if(this.props.role==="load" || this.props.role==="watch") url = "api/paint/GetPaintLoadList"
      }else{
        url = "api/paint/GetPaintPickListTest";
        if(this.props.role==="stage") url = "api/paint/GetPaintStageListTest";
        if(this.props.role==="load" || this.props.role==="watch") url = "api/paint/GetPaintLoadListTest"
      }
  
      request.open("GET", url, true);
      request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let data = JSON.parse(request.response);
         let arr = data;   //JSON.parse(data.d);
  
          let srtdData = arr.sort(sortFn);
          if(Object.prototype.toString.call(srtdData)==="[object Array]" && Object.prototype.toString.call(srtdData[0])==="[object Array]" && srtdData[0].length > 2) {
            this.setState({
              data: srtdData,
              currentRoundNumber: srtdData[0][2]
            });
          }else{
            this.setState({ data: srtdData });
          }
  
  
        } else {
  
        }
      };
      //request.send(JSON.stringify({}));
      request.send();
  
      request2.open("GET", "api/paint/getPntRevise", true);
      request2.setRequestHeader("Content-Type", "application/json; charest=utf-8");
      request2.onload = () => {
        if (request2.status >= 200 && request2.status < 400) {
          //let data = JSON.parse(request2.response).d;
          let data = request2.response;
          this.setState({currentRevision: data});
        } else {
          console.log("error");
        }
      };
        request2.send();
    }
    checkOut(data, rowIdx) {
      let url;
      let newdata = data;
      newdata[newdata.length - 1] = this.state.currentUser.name;
      //let query = { id: parseInt(data[0],10), pickedBy: this.state.currentUser.id }
      let query = "id=" + parseInt(data[0],10) + "&pickedBy=" + this.state.currentUser.id;
  
      if(this.props.environment==="production"){
        url = "api/paint/CheckOutRow";      
      }
      else {
        url = "api/paint/CheckOutRowTest";      
      }
  
      let request = new XMLHttpRequest();
  
      request.open("POST", url, true);
      //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let msg = JSON.parse(request.response);
          //let res = JSON.parse(msg.d);
          if (msg.value > 0) { this.checkOutSuccess(newdata, rowIdx); }
          else { this.performHardUpdate();}
        } else {
  
        }
      };
      //request.send(JSON.stringify(query));
      request.send(query);
    }
    checkOutSuccess(newData, rowIdx){
      let data = update(this.state.data, {$push: []});
      data[rowIdx] = newData;
      this.setState({
        data: data
      });
      this.socket.emit("rowupdate", newData);
    }
    checkIn(data, rowIdx){
      let url;
      let newdata = data;
      let request = new XMLHttpRequest();
      newdata[newdata.length - 2] = this.state.currentUser.name;
      //let query = { id: data[0], pickedBy: this.state.currentUser.id }
      let query = "id=" + parseInt(data[0],10) + "&pickedBy=" + this.state.currentUser.id;
  
      if(this.props.environment==="production"){
          url = "api/paint/CheckInRow";      
      }else{
          url = "api/paint/CheckInRowTest";        
      }
  
      request.open("POST", url, true);
      //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let res = JSON.parse(request.response);
          //let responseData = JSON.parse(res.d);        
            if (res.value > 0) {
                this.checkInSuccess(newdata, rowIdx);
            }
            else {
                this.performHardUpdate();
            }
        } 
      };
      //request.send(JSON.stringify(query));
        request.send();
    }
    checkInSuccess(newData, rowIdx){
      let dd = update(this.state.data, {$splice: [[rowIdx, 1]]});
  
      if(Object.prototype.toString.call(dd)==="[object Array]" && Object.prototype.toString.call(dd[0])==="[object Array]" && dd[0].length > 2) {
        this.setState({
          data: dd,
          currentRoundNumber: dd[0][2]
        });
      }else{
        this.setState({ data: dd })
      }
      this.socket.emit("rowupdate", newData);
    }
    release(data, rowIdx){
      let url;
      let newdata = data;
      let request = new XMLHttpRequest();
  
      newdata[newdata.length - 3] = "##AVAILABLE##";
      newdata[newdata.length - 2] = "##AVAILABLE##";
      newdata[newdata.length - 1] = "##AVAILABLE##";
      //let query = { id: data[0], pickedBy: this.state.currentUser.id }
        let query = "id=" + parseInt(data[0],10) + "&pickedBy=" + this.state.currentUser.id;
  
      if(this.props.environment==="production"){
        url = "api/paint/ReleaseRow";      
      }else{
          url = "api/paint/ReleaseRowTest";        
      }
  
      request.open("POST", url, true);
      //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let res = JSON.parse(request.response);
          //let responseData = JSON.parse(res.d);
            if (res.value > 0) {
                this.releaseSuccess(newdata, rowIdx);
            }
            else {
                this.performHardUpdate();
            }
        } 
      };
      //request.send(JSON.stringify(query));
        request.send(query);
    }
    releaseSuccess(newData, rowIdx){
      let data = update(this.state.data, {$push: []});
      data[rowIdx] = newData;
      this.setState({
        data: data
      });
      this.socket.emit("rowupdate", newData);
    }
    stage(data, rowIdx){
      let url;
      let newdata = data;
      let request = new XMLHttpRequest();
  
      //set Staged-By to current User
      newdata[newdata.length - 3] = this.state.currentUser.name;
  
  
      //let query = { id: data[0], pickedBy: this.state.currentUser.id }
        let query = "id=" + parseInt(data[0],10) + "&pickedBy=" + this.state.currentUser.id;
  
      if(this.props.environment==="production"){
          url = "api/paint/StageRow";        
      }else{
          url = "api/paint/StageRowTest";        
      }
  
      request.open("POST", url, true);
      //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let res = JSON.parse(request.response);
          //let responseData = JSON.parse(res.d);
            if (res.value > 0) {
                this.stageSuccess(newdata, rowIdx);
            }
            else {
                this.performHardUpdate();
            }
        } 
      };
      //request.send(JSON.stringify(query));
        request.send(query);
    }
    stageSuccess(newData, rowIdx){
      let data = update(this.state.data, {$splice: [[rowIdx, 1]]});
      this.setState({
        data: data
      });
      this.socket.emit("rowupdate", newData);
    }
    finalize(data){
      //let query = { id: data[0], pickedBy: this.state.currentUser.id }
        let query = "id=" + parseInt(data[0],10) + "&pickedBy=" + this.state.currentUser.id;
      let url;
      let request = new XMLHttpRequest();
  
      if(this.props.environment==="production"){
          url = "api/paint/FinalizeRow";      
      }else{
          url = "api/paint/FinalizeRowTest";        
      }
  
      request.open("POST", url, true);
      //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let res = JSON.parse(request.response);
          let responseData = JSON.parse(res.d);
          if (responseData.value > 0) { 
              debugger;
            //   this.finalizeSuccess(newdata, rowIdx); 
            }
          else { this.performHardUpdate(); }
        } else {
  
        }
      };
        //request.send(JSON.stringify(query));
        request.send(query);
    }
    finalizeSuccess(data){
      this.removeRow(data);
      this.socket.emit("rowdelete", data);
      let dd = this.state.data.slice();
      if(Object.prototype.toString.call(dd)==="[object Array]" && Object.prototype.toString.call(dd[0])==="[object Array]" && dd[0].length > 2) {
        this.setState({currentRoundNumber: dd[0][2]})
      }
    }
    updatePartialQty(amnt, data){
      let url;
      let currentRowData = data.slice();
      let updatedRowData = data.slice();
      let newRowData = data.slice();
      newRowData[0] = "0";
  
      let newQty = 0
      let updateAmt = parseInt(amnt,10);
      newQty = currentRowData[9] - updateAmt;
  
      if (newQty < 0) newQty = 0;
  
      updatedRowData[9] = updateAmt.toString();
      newRowData[9] = newQty.toString();
      newRowData[newRowData.length - 1] = "##AVAILABLE##"
  
      let query = { id: currentRowData[0], master_id: currentRowData[1], pickedBy: this.state.currentUser.id, amnt: updateAmt, newAmnt: newQty }
  
        if (this.props.environment==="production")
            url = "api/paint/updatePartialQty";    
        else
            url = "api/paint/updatePartialQtyTest";
  
      let request = new XMLHttpRequest();
  
      request.open("POST", url, true);
      request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let res = JSON.parse(request.response);
          let responseData = JSON.parse(res.d);
          console.log(responseData);
          if (responseData.numChanged > 0) {
            this.updatePartialQtySuccess(updatedRowData, newRowData, responseData);
          }
          else {
              this.performHardUpdate();
          }
        } 
  
      };
     request.send(JSON.stringify(query));
    
    }
    updatePartialQtySuccess(updatedRowData, newRowData, res){
      this.updateRow(updatedRowData);
      this.socket.emit("rowupdate", updatedRowData);
      if (parseInt(res.newId,10) > 1 && parseInt(newRowData[9],10) > 0) {
          newRowData[0] = res.newId.toString();
          this.newRow(newRowData);
          this.socket.emit("newrow", newRowData);
      }
    }
    updateRow(newData, rowIdx){
      let rowUpdated = false;
      if(this.props.role==="load"){
        let data = update(this.state.data, {$push: []});
        let temp = data.map(function(rowData, idx){
          if(rowData[0]===newData[0]) {
            rowUpdated = true;
            return newData;
          }
          else {
            return rowData;
          }
        });
        data = temp;
        if(rowUpdated){
          this.setState({data: data});
        }
      }
      else{
        if(this.props.role==="stage"){
          if (newData[newData.length - 1] !== "##AVAILABLE##" && newData[newData.length - 2] !== "##AVAILABLE##" && newData[newData.length - 3] !== "##AVAILABLE##") {
            this.removeRow(newData);
          }else{
            let data = update(this.state.data, {$push: []});
            let temp = data.map(function(rowData, idx){
              if(rowData[0]===newData[0]) {
                rowUpdated = true;
                return newData;
              }
              else {
                return rowData;
              }
            });
            data = temp;
            if(rowUpdated){
              this.setState({data: data});
            }
            else{
              this.newRow(newData);
            }
          }
        }else{
          if (newData[newData.length - 1] !== "##AVAILABLE##" && newData[newData.length - 2] !== "##AVAILABLE##") {
            this.removeRow(newData);
          }else{
            let data = update(this.state.data, {$push: []});
            let temp = data.map(function(rowData, idx){
              if(rowData[0]===newData[0]) {
                rowUpdated = true;
                return newData;
              }
              else {
                return rowData;
              }
            });
            data = temp;
            if(rowUpdated){
              this.setState({data: data});
            }
            else{
              this.newRow(newData);
            }
          }
        }
      }
    }
    removeRow(row){
      let idx = -1;
      let data = update(this.state.data, {$push: []});
      data.map(function(rowData, rowIdx){
        debugger;
        if(rowData[0]===row[0]) idx = rowIdx;
      });
  
      if(idx > -1){
        data = update(this.state.data, {$splice: [[idx, 1]]});
        this.setState({data: data});
      }
  
    }
    newRow(newData){
      let exists = false;
      let data = update(this.state.data, {$push: []});
      data.map((rowData, rowIdx) => {
        debugger;
        if(rowData[0]===newData[0]) exists = true;
      });
  
      if(!exists){
        data = update(this.state.data, {$push: [newData]});
        data.sort(sortFn);
        this.setState({data: data});
      }
    }
    UndoActionHandler(rowIdx){
      let row = update(this.state.data[rowIdx], {$push: []});
  
      switch (this.props.role) {
        case "assist":
          if(row[row.length - 1]===this.state.currentUser.name && this.props.role==="assist"){
            this.release(row, rowIdx);
          }
          break;
        case "stage":
          if (row[row.length - 1] !== "##AVAILABLE##" && row[row.length - 2] !== "##AVAILABLE##") {
            this.release(row, rowIdx);
          }
          break;
        case "load":
          if (row[row.length - 1] !== "##AVAILABLE##" && row[row.length - 2] !== "##AVAILABLE##") {
            this.release(row, rowIdx);
          }
          break;
  
        default:
  
      }
    }
    TapActionHandler(rowIdx, tapTarget){
      let row = update(this.state.data[rowIdx], {$push: []});
      switch (this.props.role) {
        case "assist":
          if(row[row.length - 1]==="##AVAILABLE##"){
            this.checkOut(row, rowIdx);
          }else{
            if(row[row.length - 1]===this.state.currentUser.name && this.props.role==="assist" && this.props.OSName==="Windows" && tapTarget.classList.contains("label")){
              this.checkIn(row, rowIdx);
            }
          }
          break;
        case "stage":
          if (row[row.length - 1] !== "##AVAILABLE##" && row[row.length - 2] !== "##AVAILABLE##" && row[row.length - 3] !== "##AVAILABLE##" && this.props.OSName==="Windows" && tapTarget.classList.contains("label")) {
              this.stage(row);
          }
          break;
        case "load":
          if (row[row.length - 1] !== "##AVAILABLE##" && row[row.length - 2] !== "##AVAILABLE##" && this.props.OSName==="Windows" && tapTarget.classList.contains("label")) {
              this.finalize(row);
          }
          break;
        default:
  
      }
    }
    SwipeActionHandler(rowIdx){
      let row = update(this.state.data[rowIdx], {$push: []});
  
      switch (this.props.role) {
        case "assist":
          if(row[row.length - 1]===this.state.currentUser.name && this.props.role==="assist"){
            this.checkIn(row, rowIdx);
          }
          break;
        case "stage":
          if(row[row.length - 1] !== "##AVAILABLE##" && row[row.length - 2] !== "##AVAILABLE##"){
            this.stage(row, rowIdx);
          }
          break;
        case "load":
          if (row[row.length - 1] !== "##AVAILABLE##" && row[row.length - 2] !== "##AVAILABLE##") {
              this.finalize(row);
          }
          break;
        default:
      }
    }
    render(){
      let hidden = {display: "none"};
      return(
        <div>
          <div className="centerDiv">
              <h3 style={{textDecoration: "underline"}}>Paint {this.props.role==="load" ? "Load": this.props.role ==="stage" ? "Staging":"Pick"} List {this.props.environment==="development"? "(Dev)":""}</h3>
          </div>
          <h1 style={{marginLeft: "2.5%"}}>Current Round: <span id="roundDisplay" className="label label-default">{this.state.currentRoundNumber}</span></h1>
          <h3 style={{marginLeft: "5%"}}>Schedule Revision: <strong><span id="revisionDisplay">{this.state.currentRevision}</span></strong></h3>
          <div>
            <label>Rework Driver?</label><input type="checkbox"/>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="undo"></th>
                <th style={hidden}>master_id </th>
                <th style={hidden}>round</th>
                <th style={hidden}>round_position</th>
                <th>Description</th>
                <th>Color</th>
                <th>Mold Skin Style</th>
                <th>Rework Color Chart</th>
                <th>Quantity</th>
                <th className="action" style={{width:"70px"}}></th>
                <th style={hidden}>Handled By</th>
                <th>Picked By</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((rowData, rowIdx) => {
                debugger;
                if(rowIdx < 26){
                  return (
                    <HammerRow
                      role={this.props.role}
                      key={rowData[0]}
                      rowId={rowIdx}
                      rowData = { rowData }
                      UndoActionHandler = { this.UndoActionHandler }
                      TapActionHandler = { this.TapActionHandler }
                      SwipeActionHandler = { this.SwipeActionHandler }
                      currentUser = {this.state.currentUser}
                      >
                      {COLUMN_DEFINITIONS.map((columnMetaData, colIdx) => {
                        debugger;
                        if(columnMetaData.visible !== false){
                          if(columnMetaData.CellRenderer) return (<columnMetaData.CellRenderer role={this.props.role} key={rowData[0] + "-" + colIdx} rowData={rowData} updatePartialQty={this.updatePartialQty} currentUser={this.state.currentUser}>{rowData[columnMetaData.data]}</columnMetaData.CellRenderer>)
                          else return (<td className={columnMetaData.className ? columnMetaData.className : ""} key={rowData[0] + "-" + colIdx}>{rowData[columnMetaData.data]}</td>);
                        }
                      })}
                    </HammerRow>
                  )
                }
              })}
            </tbody>
          </table>
        </div>
      )
    }
  }