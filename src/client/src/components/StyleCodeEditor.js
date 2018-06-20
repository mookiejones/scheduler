import React from 'react';
import { StyleCodeEditorContextMenu } from './Context';
import {
  CustomerOptionsEditor,
  AssemblyFlowOptionsEditor,
  LocationOptionsEditor 
} from './Editors'; 
import { Editors, Formatters } from 'react-data-grid-addons';
import * as $ from 'jquery'; 
var ReactDataGrid = require('react-data-grid');
var classnames = require('classnames');
var update = require('react-addons-update');
const heightOffset = 150; 


function validRow(row){
  try{
    return (  row["style_code"].length > 0
              && row["style_name"].length > 0
              && row["assembly_flow"].length > 0
              && row["pcs_per_carrier"].length > 0
              && row["customer"].length > 0
              && row["mold_wip_rack_density"].length > 0
              && row["primary_bag"].length > 0
            )
  }catch(e){
    console.log(e);
    return false;
  }
}

function eis(e, s, a = null){
  var idx = -1;
  for(var x = 0; x < s.length; x++){
    if(a){
      if(s[x][a] == e) idx = x;
    }else{
      if(s[x] == e) idx = x;
    }
  }
  return idx;
}



class RowRenderer extends React.Component{
  setScrollLeft(scrollBy) {
    this.refs.row.setScrollLeft(scrollBy);
  }
  render() {
    var programColIdx = -1;
    var row = this.props.row;
    var columns = this.props.columns;
    var programs = this.props.getPrograms();

    var rowStyle = classnames({
      'bg-success': row.id.substring(0, 4) == "TEMP",
      'bg-normal': row.id.substring(0, 4) != "TEMP"
    });

    for(var i = 0; i < columns.length; i++){
      if (columns[i].key == "program") programColIdx = i;
    }

    //columns[programColIdx].editor = <DropDownEditor options={programs} />
    //columns[programColIdx].formatter = <DropDownFormatter options={programs} value={row.program || ""}/>

    return (<ReactDataGrid.Row className={rowStyle} ref="row" extraClasses={rowStyle} {...this.props}/>)
  }
}

export class StyleCodeEditor extends React.Component{
  constructor(props,context){
    super(props,context);
    this._columns = [
      {
        key: 'id',
        name: 'Style',
        width: 65,
        editable : false,
        sortable: true
      },
      {
        key: 'programname',
        name: 'Program',
        editable: false,
        sortable: true
      },
      {
        key: 'description',
        name: 'Description',
        //width: 150,
        editor: false,
        sortable: true
      },
      {
        key: 'PartsPerCarrier',
        name: 'Parts Per Carrier',
        editable: false
      },
      {
        key: 'customer',
        name: 'Customer',
        editor: CustomerOptionsEditor,
        sortable: true
      },
      {
        key: 'assembly_flow',
        name: 'Assembly Flow',
        editor: AssemblyFlowOptionsEditor
      },
      {
        key: 'mold_wip_location',
       name: 'Mold Wip Location',
       editor: LocationOptionsEditor
      },
      {
       key: 'mold_wip_rack_density',
       name: "Mold Wip Density",
       editable: true
      },
      {
       key: 'primary_bag',
       name: 'Primary Bag',
       editable: true
      },
      {
        key: 'secondary_bag',
        name: 'Secondary Bag',
        editable : true
      }
    ]

    this.state= {
      // env: this.props.route.env,
      rows : [],
      originalRows : [],
      programs: [
        //{ id: item.id, value: item.id, text:item.program, title:item.program }
      ],
      changedRows: [],
      selectedIds: [],
      programs: [
        {id:"1",text:"Service",title:"Service",value:"1"}
      ],
      numSelected: 0,
      newRows: 0,
      height: window.innerHeight-heightOffset
    }
  }
  
  getDefaultProps() {
    return {rowKey: 'style_code'}
  }
  componentWillMount (){
    this.getStyles();
  }
  componentDidMount (){
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount (){
    window.removeEventListener('resize', this.handleResize);
  }
  componentDidUpdate (prevProps, prevState){
    if(this.state.changedRows.length > 0){
      this.persistUpdatedRows();
    }
  }
  getStyles(){
    var request = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();

      var url = "api/paint/GetPaintScheduleStyles";
      var url2 = "api/paint/GetPaintSchedulePrograms";

    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        debugger;
        // let data = JSON.parse(request.response);
        // //var arr = JSON.parse(data.d);        
        // this.setState({rows: data, originalRows: data});
      } else {

      }
    };
    request.send(JSON.stringify({}));    

    request2.open('GET', url2, true);
    request2.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request2.onload = () => {
      if (request2.status >= 200 && request2.status < 400) {
        debugger;
        // var data = JSON.parse(request2.response);
        // //var arr = JSON.parse(data.d);        
        // var programs = data.map(function(item, index){
        //   return { id: item.id, value: item.id, text:item.program, title:item.program }
        // });
        // this.setState({programs: programs});
      } else {

      }
    };
    request2.send(JSON.stringify({}));
  }
  getPrograms(){
    return this.state.programs;
  }
  rowGetter (rowIdx){
    return this.state.rows[rowIdx]
  }
  deleteRow(e, data) {
    var rowIdx = data.rowIdx;
    var rows = this.state.rows;

    var changedRows = this.state.changedRows;
    var deletedRow = this.state.rows[data.rowIdx];

    this.state.rows.splice(data.rowIdx, 1);
    this.setState({rows: this.state.rows, changedRows: changedRows});
  }
  insertRowAbove(e, data) {
    this.insertRow(data.rowIdx);
  }
  insertRowBelow(e, data) {
    this.insertRow(data.rowIdx + 1);
  }
  insertRow(rowIdx) {
    var rows = this.state.rows;
    var newRows = this.state.newRows;

    var newRow = {
      id: "TEMP-ID-" + this.state.newRows
    }

    rows.splice(rowIdx, 0, newRow);
    this.setState({rows: rows, newRows: newRows+1});
  }
  handleRowUpdated (e){
    let rows = this.state.rows.slice();
    let tempRows = this.state.rows.slice();
    var changed = this.state.changedRows.slice();

    tempRows[e.rowIdx] = update(tempRows[e.rowIdx],  {$merge: e.updated});


    if(rows[e.rowIdx][e.cellKey] != e.updated[e.cellKey]){
      //get last changes
      var changed_row = update(rows[e.rowIdx], {$merge: e.updated});
      var previous_changedRowIdx = this.rowPreviouslyChanged(changed_row.id);

      if(previous_changedRowIdx == -1){
        changed.push(update(changed_row, {$merge: {action:'UPDATE'}}));
      }else{
        changed[previous_changedRowIdx] = update(changed[previous_changedRowIdx], {$merge: e.updated});
      }

      Object.assign(rows[e.rowIdx], e.updated);
      this.setState({rows:rows, changedRows: changed});
    }
  }
  persistUpdatedRows(){
    var changed = this.state.changedRows;
    var numChanged = changed.length;
    var valid = [], temp = [];
        
    var url = this.state.env == "production" ? "api/paint/UpdateStyleCodes" : "api/paint/UpdateStyleCodesTest";
    //console.log(this.state.programs);
    changed.map((row, idx) => {
      if(!row.id.includes("TEMP")){
        var idx = eis(row.program, this.state.programs, 'text');
        if(idx > -1){
          row.program = this.state.programs[idx]['id'];
        }else{
          var programId = parseInt(row.program,10);
          if(programId > -1){
            row.program = programId;
          }
        }

        //row.program = getProgramId(row.program);
        valid.push(row);
      }else{
        temp.push(row);
      }
    });


    if(valid.length > 0){
      console.log(valid)
      $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({rows: valid}),
        contentType: "application/json; charest=utf-8",
        dataType: "json",
        success(msg) {
           var data = JSON.parse(msg);
           //persist to database
           //this.setState({rows: update(data, {$push:[]}), initialRows: update(data, {$push:[]})});
           this.setState({changedRows: update(temp, {$push:[]})});
           this.getStyles();
        },
        error(request, status, error) {
           console.log(error);
        }
      });
    }

  }
  persistNewRows(){
    var allValid = true;
    var changed = this.state.changedRows;
    var numChanged = changed.length;
    var valid = [], temp = [];
    var url = this.state.env == "production" ? "api/paint/UpdateStyleCode" : "api/paint/UpdateStyleCodeTest";

    changed.map(function(row, idx){
      if(!row.id.includes("TEMP")){
        valid.push(row);
      }else{
        temp.push(row);
      }
    });

    for(var x = 0; x < temp.length; x++){
      if(!validRow(temp[x])){
        allValid = false
        console.log('invalid')
      }
    }
    var xhr = []
    var url = "api/paint/PersistStyleCodeRow";
    if(allValid){
      for(var x = 0; x < temp.length; x++){
        //console.log(temp[x]['program']);
        var param = {
          assembly_flow: temp[x]['assembly_flow'],
          color_change_program: temp[x]['color_change_program'],
          customer: temp[x]['customer'],
          id: temp[x]['id'],
          mold_wip_rack_density: temp[x]['mold_wip_rack_density'],
          mold_wip_location: temp[x]['mold_wip_location'] || "",
          pcs_per_carrier: temp[x]['pcs_per_carrier'],
          primary_bag: temp[x]['primary_bag'],
          program: temp[x]['program'],
          secondary_bag: temp[x]['secondary_bag'] || "",
          style_code: temp[x]['style_code'],
          style_name: temp[x]['style_name']
        }

        $.ajax({
          method: "POST",
          url: url,
          data: JSON.stringify(param),
          contentType: "application/json; charest=utf-8",
          dataType: "json",
          success(msg) {
             var data = JSON.parse(msg);
             this.getStyles();
          },
          error(request, status, error) {
             console.log(error);
          }
        });
      }
    }
  }
  handleRowUpdateFailed(){}
  rowPreviouslyChanged(key){
    for(var i = 0; i < this.state.changedRows.length; i++){
      if(this.state.changedRows[i].id == key) return i;
    }
    return -1;
  }
  handleResize(e) {
    this.setState({height: window.innerHeight-heightOffset});
  }
  handleGridRowsUpdated({ fromRow, toRow, updated }) {
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
        var previous_changedRowIdx = this.rowPreviouslyChanged(updatedRow.id);
        if(previous_changedRowIdx == -1){
          changedRows.push(update(updatedRow, {$merge: {action:'UPDATE'}}));
        }else{
          changedRows[previous_changedRowIdx] = update(changedRows[previous_changedRowIdx], {$merge: updated});
        }
        rows[i] = updatedRow;
      }
    }

    this.setState({ rows: rows, changedRows: changedRows });
  }
  handleGridSort(sortColumn, sortDirection){
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        if(sortColumn == 'id') return (parseInt(a[sortColumn],10) > parseInt(b[sortColumn],10)) ? 1 : -1;
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        if(sortColumn == 'id') return (parseInt(a[sortColumn],10) < parseInt(b[sortColumn],10)) ? 1 : -1;
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  }
  render(){
    var changes = this.state.changedRows < 1;
    var newrows = this.state.newRows;

    return(
      <div className="rdg">
        <ReactDataGrid
          ref={(grid) => this.grid = grid}
          contextMenu={
            <StyleCodeEditorContextMenu
              newRows={newrows > 0}
              onRowDelete={this.deleteRow}
              onRowInsertBelow={this.insertRowBelow}
              onPersistNewRow={this.persistNewRows}
            />
          }
          rowKey='style_code'
          enableCellSelect={true}
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={this.state.height}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          onGridSort={this.handleGridSort}
          rowRenderer={<RowRenderer getPrograms={this.getPrograms}/>}
        />
    </div>
    )
  }
}
 
