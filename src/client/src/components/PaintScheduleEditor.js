import * as $ from 'jquery';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import update from 'react-addons-update';
import * as ReactDataGrid from 'react-data-grid';
import {  } from 'react-data-grid-addons';
import  ReactDataGridPlugins from 'react-data-grid-addons';
import { RoundSummary } from './RoundSummary';
import * as classnames from 'classnames';

var AutoCompleteEditor = ReactDataGridPlugins.Editors.AutoComplete;
var ContextMenu = ReactDataGridPlugins.Menu.ContextMenu;
var MenuItem = ReactDataGridPlugins.Menu.MenuItem;
var SubMenu = ReactDataGridPlugins.Menu.SubMenu;

const heightOffset = 250;

 

export class NotesFormatter extends Component {
  render(){
    var labelClass = classnames({ 
      'redhot': this.props.value.toLowerCase().includes("red hot"),
    });
    return(<div className={labelClass}>{this.props.value}</div>);
  }
}
//Columns definition

export class ReactiveBtn extends Component{ 
 
  render(){
    return(
      <Button
      isActive={this.props.numChanged >0}
      onClick={this.props.clickEvent}
      bsStyle="warning">{this.props.text}</Button>
  );
  }
}

class PaintScheduleEditorContextMenu extends React.Component {
  constructor(props,context){
    super(props,context);
  }
  onRowDelete(e, data) {
    if (typeof(this.props.onRowDelete) === 'function') {
      this.props.onRowDelete(e, data);
    }
  }
  onDeleteSelectedRows(e, data){
    if (typeof(this.props.onDeleteSelectedRows) === 'function') {
      this.props.onDeleteSelectedRows(e, data);
    }
  }
  onRowInsertAbove(e, data) {
    if (typeof(this.props.onRowInsertAbove) === 'function') {
      this.props.onRowInsertAbove(e, data);
    }
  }
  onRowInsertBelow(e, data) {
    if (typeof(this.props.onRowInsertBelow) === 'function') {
      this.props.onRowInsertBelow(e, data);
    }
  }
  onCopyToNewRound(e, data){
    if (typeof(this.props.onCopyToNewRound) === 'function') {
      this.props.onCopyToNewRound(e, data);
    }
  }
  onCopyToEndOfRound(e, data){
    if (typeof(this.props.onCopyToEndOfRound) === 'function') {
      this.props.onCopyToEndOfRound(e, data);
    }
  }
  onCopySelectedAbove(e, data){
    if (typeof(this.props.onCopySelectedAbove) === 'function') {
      this.props.onCopySelectedAbove(e, data);
    }
  }
  onCopySelectedBelow(e, data){
    if (typeof(this.props.onCopySelectedBelow) === 'function') {
      this.props.onCopySelectedBelow(e, data);
    }
  }
  onPersistNewRow(e, data){
    if (typeof(this.props.onPersistNewRow) === 'function') {
      this.props.onPersistNewRow(e, data);
    }
  }
  render() {
    var multipleSelected = this.props.multipleSelected;
    var newRows = this.props.newRows;
    return (
      <ContextMenu>
        <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onPersistNewRow} disabled={!newRows}>Save Row(s)</MenuItem>
        <SubMenu title="Insert Row" disabled={multipleSelected}>
          <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertBelow}>Below</MenuItem>
          <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertAbove}>Above</MenuItem>
        </SubMenu>
        <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowDelete} disabled={multipleSelected}>Delete Row</MenuItem>
      </ContextMenu>
    );
  }
}
 
export class RowRenderer extends  React.Component {
  setScrollLeft(scrollBy) {
    this.refs.row.setScrollLeft(scrollBy);
  }
  render() {
    var colorColIdx = 7;
    var row = this.props.row;
    var id = (row.id || "")
    var color = (row.color || "").toLowerCase();
    var notes = (row.notes || "").toLowerCase();
    var columns = this.props.columns;
    var pgc = this.props.getProgramColors(row.style_code);

    var rowStyle = classnames({
      'bg-success': id.substring(0, 4) == "TEMP",
      'bg-normal': id.substring(0, 4) != "TEMP",
      'service': color.includes("service"),
      'dontship': notes.includes("do not ship"),
      'shipifgood': notes.includes('ship if good'),
      'build': notes.includes("build")
    });

    if(pgc == undefined) pgc = [{color_desc:"999"}];

    if(columns[colorColIdx].key != "color"){
      for(var i = 0; i < columns.length; i++){
        if (columns[i].key == "color") colorColIdx = i;
      }
    }
    columns[colorColIdx].editor = <AutoCompleteEditor options={pgc} />

    return (<ReactDataGrid.Row className={rowStyle} ref="row" extraClasses={rowStyle} {...this.props}/>)
  }
}

export class PaintScheduleEditor extends React.Component{

  constructor(props,context){
    super(props,context);
    this.state={
      groupBy: [], expandedRows: {},
      // env: this.props.route.env,
      initialRows: [],
      rows : [],
      roundSummary: [],
      queuedUpdates: {},
      changedRows: [],
      selectedIds: [],
      styleCodes: [],
      programColors: [],
      selectedRound: null,
      numSelected: 0,
      newRows: 0,
      height: window.innerHeight-heightOffset,
      firstLoad: true
    }
  }
  getDefaultProps (){
    return {rowKey: 'id', ruleSet: {}}
  }
  componentWillMount(){
    this.getPaintSchedule();
    this.getStyleCodesAndProgramColors();
  }
  componentDidMount (){
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  componentDidUpdate (prevProps, prevState){
    if(this.state.firstLoad){
      if(this.state.rows.length > 0){
        document.querySelector('.react-grid-Canvas').scrollTop = document.querySelector('.react-grid-Canvas').scrollHeight;
        this.setState({firstLoad: false});
      }
    }
  }
  handleResize(e) {
    this.setState({height: window.innerHeight-heightOffset});
  }
  getPaintSchedule(dateStr){
    var url;

    if(this.props.environment == 'production'){
      url = "../paint.asmx/GetPaintSchedule";
    }else{
      url = "../paint.asmx/GetPaintScheduleTest";
    }

    $.ajax({
      method: "POST",
      url: url,
      data: JSON.stringify({}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success (msg) {
         var data = JSON.parse(msg.d);
         var roundData = data[0] || [];
         var roundSummaryData = data[1] || [];
         var selectedRound;
         if(roundSummaryData.length > 0){ selectedRound = roundSummaryData[roundSummaryData.length-1]['round'] }
         else { selectedRound = null; }
         var roundSummary = {};
         if(data[1]){
           for(var i = 0; i < data[1].length; i++){
             roundSummary[data[1][i]['round']] = data[1][i];
           }
         }

         this.setState({
           rows: roundData.slice(),
           initialRows: roundData.slice(),
           roundSummary: roundSummary,
           selectedRound: selectedRound
         });
      },
      error (request, status, error) {
         console.log(error);
      }
    });
  }
  getStyleCodesAndProgramColors(){
    var url, url2;

    if(this.props.environment == "production"){
      url = "../paint.asmx/GetPaintScheduleStyles"
    }else{
      url = "../paint.asmx/GetPaintScheduleStyles" //test
    }
    $.ajax({
      method: "POST",
      url: url,
      data: JSON.stringify({}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success (msg) {
         var data = JSON.parse(msg.d);
         //console.log(data);
         this.setState({ styleCodes: data.slice() });
      },
      error (request, status, error) {
         console.log(error);
      }
    });

    if(this.props.environment == "production"){
      url2 = "../paint.asmx/GetProgramColors"
    }else{
      url2 = "../paint.asmx/GetProgramColors" //test
    }
    $.ajax({
      method: "POST",
      url: url2,
      data: JSON.stringify({}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success (msg) {
         var data = JSON.parse(msg.d);
         var hash = {};
         for(var x = 0; x < data.length; x++){
            if(!hash[data[x]['style_code']]){
              hash[data[x]['style_code']] = [];
            }
            hash[data[x]['style_code']].push({id: data[x]['color_code'], title: data[x]['color_desc']});
         }
         this.setState({programColors: hash});
      },
      error (request, status, error) {
         console.log(error);
      }
    });
  }
  getStyleCodePresets(style_code){
    for(var i = 0; i < this.state.styleCodes.length; i++){
       if(this.state.styleCodes[i].id == style_code){
         return update(this.state.styleCodes[i], {$merge:{}});
       }
    }
    return {};
  }
  getProgramColors(style_code){
    return this.state.programColors[style_code];
    var style_metadata = this.getStyleCodePresets(style_code);
    var color_change_program = style_metadata.color_change_program;
    var programColors = [];

    for (var i = 0; i < this.state.programColors.length; i++){
      if(this.state.programColors[i].style_code == style_code) programColors.push(this.state.programColors[i]);
      if(parseInt(this.state.programColors[i].style_code) > parseInt(style_code)) break;
    }

    return programColors;
  }
  rowGetter(rowIdx){
    return this.state.rows[rowIdx]
  }
  deleteRow(e, data) {
    var rowIdx = data.rowIdx;
    var rows = this.state.rows;
    var newRows = this.state.newRows;
    var temp = (rows[rowIdx].id.includes("TEMP"));

    var currentRound = parseInt(rows[rowIdx].round);
    var currentPos = parseInt(rows[rowIdx].round_position);

    var changedRows = this.state.changedRows;
    var deletedRow = this.state.rows[data.rowIdx];

    var temp = update(deletedRow, {$merge: {action:'DELETE'}})
    var hash = "{0}:{1}:{2}".formatUnicorn(deletedRow.id, JSON.stringify({action:'DELETE'}), JSON.stringify(temp)).hashCode().toString();

    this.persistRow(hash, temp);
    /*
    changedRows.push(update(deletedRow, {$merge: {action: 'DELETE'}}));


    for(var i = rowIdx; i < rows.length; i++){
      if(parseInt(rows[i].round) == currentRound && parseInt(rows[i].round_position) >= currentPos){
        rows[i].round_position = (parseInt(rows[i].round_position) - 1).toString();
      }
    }

    this.state.rows.splice(data.rowIdx, 1);

    if(!temp){
      this.setState({rows: this.state.rows, changedRows: changedRows});
    }else{
      this.setState({rows: this.state.rows, changedRows: changedRows, newRows: newRows-1});
    }*/
  }
  insertRowAbove(e, data) {
    this.insertRow(data.rowIdx);
  }
  insertRowBelow(e, data) {
    this.insertRow(data.rowIdx + 1);
  }
  insertRow(rowIdx2) {

    if(this.state.insertingRow) return;
    this.setState({insertingRow: true});

    var rows = this.state.rows;
    var length = rows.length;
    var lastRow = (rowIdx2 == length);
    var rowIdx = (lastRow) ? rowIdx2 - 1 : rowIdx2

    var currentRound = parseInt(rows[rowIdx].round);
    var currentPos = parseInt(rows[rowIdx].round_position);
    var newRows = this.state.newRows;

    for(var i = rowIdx; i < rows.length; i++){
      if(parseInt(rows[i].round) == currentRound && parseInt(rows[i].round_position) >= currentPos){
        rows[i].round_position = (parseInt(rows[i].round_position) + 1).toString();
      }
    }

    var newRow = {
      id: "TEMP-ID-" + this.state.newRows,
      round: currentRound,
      round_position: lastRow ? currentPos + 1 : currentPos,
      color: "",
      notes: ""
    }
    rows.splice(rowIdx2, 0, newRow);
    this.setState({rows: rows, newRows: newRows+1});
  }
  handleRowUpdated(e){
    //merge updated row with current row and rerender by setting state
    var rows = update(this.state.rows, {$merge: {}});
    var tempRows = update(rows, {$merge: {}});
    tempRows[e.rowIdx] = update(tempRows[e.rowIdx],  {$merge: e.updated});
    var changed = update(this.state.changedRows, {$merge: {}});

    if(rows[e.rowIdx][e.cellKey] != e.updated[e.cellKey]){
      if(e.cellKey == "style_code"){
        var style_metadata = this.getStyleCodePresets(e.updated[e.cellKey]);
        var new_rowdata = {
          style_code: style_metadata.style_code,
          assembly_flow: style_metadata.assembly_flow,
          customer: style_metadata.customer,
          program: style_metadata.style_name
        }
        tempRows[e.rowIdx] = update(tempRows[e.rowIdx],  {$merge: new_rowdata});
      }
      //get last changes
      var changed_row = tempRows[e.rowIdx];
      var previous_changedRowIdx = this.rowPreviouslyChanged(changed_row.id);

      if(previous_changedRowIdx == -1){
        changed.push(update(changed_row, {$merge: {action:'UPDATE'}}));
      }else{
        changed[previous_changedRowIdx] = update(changed[previous_changedRowIdx], {$merge: tempRows[e.rowIdx]});
      }

      if(this.applyRuleSet(tempRows)){
        rows[e.rowIdx] = update(rows[e.rowIdx], {$merge: tempRows[e.rowIdx]});
        this.setState({rows:rows, changedRows: changed});
      }else{
        console.log("failed pass ruleset");
      }
    }
  }
  handleRowUpdateFailed(){}
  handleGridRowsUpdated({ fromRow, toRow, updated }) {

    if (fromRow !== toRow)
    return;

    let rows = this.state.rows.slice();
    let changedRows = this.state.changedRows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      var changed = false;
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});

      Object.keys(updated).map(function(key, idx){
        if(rowToUpdate[key] != updatedRow[key]) changed = true;
      });

      if(changed){
        if(updated.style_code){
          var style_metadata = this.getStyleCodePresets(updated.style_code);
          var new_rowdata = {
            assembly_flow: style_metadata.assembly_flow,
            customer: style_metadata.customer,
            program: style_metadata.description,
            pieces: style_metadata.PartsPerCarrier ? style_metadata.PartsPerCarrier : 0,
            mold_wip_density: style_metadata.mold_wip_rack_density,
            total_crs: 1,
            total_pcs: 1 * style_metadata.PartsPerCarrier
          }
          updatedRow = update(updatedRow, {$merge: new_rowdata});
        }

        /*
        var previous_changedRowIdx = this.rowPreviouslyChanged(updatedRow.id);
        if(previous_changedRowIdx == -1){
          if(updatedRow.id.includes("TEMP")){
            changedRows.push(update(updatedRow, {$merge: {action:'INSERT'}}));
          }else{
            changedRows.push(update(updatedRow, {$merge: {action:'UPDATE'}}));
          }
        }else{
          changedRows[previous_changedRowIdx] = update(changedRows[previous_changedRowIdx], {$merge: updated});
        }
        */
        if(updatedRow.id.includes("TEMP")){
          if(!updatedRow['style_code'] || !(parseInt(updatedRow['pieces']) >= 0) || !updatedRow['program'] || !updatedRow['round'] || !(parseInt(updatedRow['total_crs']) >= 0) || !(parseInt(updatedRow['total_pcs']) >= 0) || updatedRow['customer'] == undefined || !(parseInt(updatedRow['mold_wip_density']) >= 0) || !updatedRow['round_position']){
            rows[i] = updatedRow;
            this.setState({ rows: rows });
          }else{
            var temp = update(updatedRow, {$merge: {action:'INSERT'}})
            var hash = "{0}:{1}:{2}".formatUnicorn(updatedRow.id, JSON.stringify(updated), JSON.stringify(temp)).hashCode().toString();
            this.persistRow(hash, temp);

          }
        }else{
          var temp = update(updatedRow, {$merge: {action:'UPDATE'}})
          var hash = "{0}:{1}:{2}".formatUnicorn(updatedRow.id, JSON.stringify(updated), JSON.stringify(temp)).hashCode().toString();
          this.persistRow(hash, temp);
        }
        //rows[i] = updatedRow;
      }
    }

    //this.setState({ rows: rows, changedRows: changedRows });
  }
  handleCellSelect(selected){
    this.setState({selectedRound: this.state.rows[selected.rowIdx]['round']});
  }
  persistNewRow(e, data){
    console.log('very persistent ;)');
  }
  persistRow(hash, row){
    var url = "../paint.asmx/UpdatePaintSchedule";
    if(this.state.env == "development") url = "../paint.asmx/UpdatePaintScheduleTest";
    var updateq = Object.assign({}, this.state.queuedUpdates);

    if(updateq[hash]) return;
    updateq[hash] = 1;

    this.setState({queuedUpdates: updateq});

    $.ajax({
      method: "POST",
      url: url,
      data: JSON.stringify({ss: [row]}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success (msg) {
         var data = JSON.parse(msg.d);
         var updateq2 = Object.assign({}, this.state.queuedUpdates);
         updateq2[hash] = 0;
         delete updateq2[hash];
         this.setState({queuedUpdates: updateq2, insertingRow: false});
         this.getPaintSchedule();
      },
      error (request, status, error) {
         console.log(error);
      }
    });
  }
  rowPreviouslyChanged(key){
    for(var i = 0; i < this.state.changedRows.length; i++){
      if(this.state.changedRows[i].id == key) return i;
    }
    return -1;
  }
  addNewRound(){
    var string = "Add new round?";

    var url = "../paint.asmx/ScheduleNewRoundTest"
    if(this.state.env == "development") url = "../paint.asmx/ScheduleNewRoundTest"

    if(this.state.newRows > 0) string = "Unsaved rows will be lost! Continue?";

if(true){//}    if(confirm(string)){
      $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({
          selectedDate: this.state.selectedDate
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success (msg) {
          var data = JSON.parse(msg.d);
          var roundData = data[0] || [];
          var roundSummary = {};
          if(data[1]){
            for(var i = 0; i < data[1].length; i++){
              roundSummary[data[1][i]['round']] = data[1][i];
            }
          }

          this.setState({
            rows: roundData.slice(),
            initialRows: roundData.slice(),
            roundSummary: roundSummary,
            selectedRound: data[1][data[1].length-1]['round']
          });
        },
        error (request, status, error) {
           console.log(error);
        }
      });
    }
  }
  applyRuleSet(newTable){
    //var tableCopy = update(newTable, {$merge:{}});
    //var Results = [];
    //for(var i = 0; i < RuleSet.rules.length; i++){
    //  var currentRule = RuleSet.rules[i];
    //  for(var j = 0; j < tableCopy.length - 1; j++){
    //    var thisRow = tableCopy[j], nextRow = tableCopy[j+1];
    //      if(!currentRule.check(thisRow, nextRow)) return false;
    //  }
    //}
    return true;
  }
  reset(){
    if(this.state.changedRows.length > 0){
      this.setState({
        rows : this.state.initialRows.slice(),
        changedRows: [],
        selectedIds: [],
        numSelected: 0,
        newRows: 0,
      });
    }
  }
  render(){

    var changes = this.state.changedRows < 1;
    var numSelected = this.state.numSelected
    var newrows = this.state.newRows;

//Columns definition
var columns = [
  {
    key: 'round',
    name: 'Round',
    width: 65,
    editable : false
  },
  {
    key: 'style_code',
    name: 'Style Code',
    width: 90,
    editable: true
  },
  {
    key: 'pieces',
    name: 'PPC',
    width: 50,
    editable : true
  },
  {
    key: 'assembly_flow',
    name: 'Assembly Flow',
    width: 125,
    editable : true
  },
  {
      key: 'program',
      name: 'Program',
      editable : true,
      width: 125
    },
    {
      key: 'mold_skin_style',
      name: 'Mold Skin/Style',
      editable: true,
      width: 225,
    },
    {
      key: 'notes',
      name: 'Notes',
      width: 250,
      editable: true,
      formatter: NotesFormatter
    },
    {
      key: 'rework_color_chart',
      name: 'Rework Color Chart',
      editable : true,
      width: 200,
    },
    {
      key: 'color',
      name: 'Color',
      editable : true,
      width: 125,
    },
    {
        key: 'add_take_off',
        name: 'ATO',
        width: 50,
        editable : true
    },
    {
      key: 'total_crs',
      name: 'Total Crs',
      width: 75,
      editable : true
    },
    {
      key: 'total_pcs',
      name: 'Total Pcs',
      width: 90,
      editable : true
    },
    {
      key: 'customer',
      name: 'Customer',
      editable : true,
      width: 100
    },
    {
      key: 'crs_real_time',
      name: 'Carriers Real Time',
      width: 150,
      editable : true
    },
    {
      key: 'mold_wip_density',
      name: 'WIP Density',
      width: 110,
      editable : true
    },
    {
      key: 'loc',
      name: 'WIP Location',
      width: 200,
      editable: true
    },
    {
      key: 'assy_build_option',
      name: 'Build Option',
      width: 150,
      editable: true
    }
]

    return(

      <div className='rdg'>
     
         <RoundSummary round={this.state.selectedRound}
          roundSummary={this.state.roundSummary}/>
        <ReactDataGrid
          // contextMenu={
          //   <PaintScheduleEditorContextMenu
          //     multipleSelected={numSelected > 0}
          //     newRows={this.state.newRows > 0}
          //     onRowDelete={this.deleteRow}
          //     onRowInsertAbove={this.insertRowAbove}
          //     onRowInsertBelow={this.insertRowBelow}
          //     onPersistNewRow={this.persistNewRow}
          //   />
          // }
          enableCellSelect={true}
          onCellSelected = {this.handleCellSelect}
          columns={columns}
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={this.state.height}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          rowRenderer={<RowRenderer getProgramColors={this.getProgramColors}/>}
        /> 

      <ReactiveBtn clickEvent={this.addNewRound} text="New Round"  />
      </div>
    )
  }
}