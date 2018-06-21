import * as $ from "jquery";
import * as ReactDataGrid from "react-data-grid";
import React, { Component } from "react";
import update from "react-addons-update";
import PropTypes from "prop-types";

import RowRenderer from "./PaintScheduleEditor.RowRenderer";
import ReactiveBtn from "./PaintScheduleEditor.ReactiveBtn";
import { RoundSummary } from "./RoundSummary";
import { NotesFormatter } from "./NotesFormatter";
import DataService from "../api/DataService";
import PaintScheduleEditorContextMenu from "./PaintScheduleEditor.ContextMenu";
 
const heightOffset = 250;

export default class PaintScheduleEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this._rows = [];
    this.state = {
      // env: this.props.route.env,
      initialRows: [],
      rows: [],
      roundSummary: [],
      queuedUpdates: {},
      changedRows: [],
      styleCodes: [],
      programColors: [],
      selectedRound: null,
      numSelected: 0,
      newRows: 0,
      height: window.innerHeight - heightOffset,
      firstLoad: true
    };
  }

  componentWillMount() {
    this.getPaintSchedule();
    this.getStyleCodesAndProgramColors();
  }
  componentDidMount() {
    window.addEventListener("resize", () =>
      this.setState({ height: window.innerHeight - heightOffset })
    );
  }
  componentDidUpdate() {
    if (this.state.firstLoad) {
      if (this.state.rows.length > 0) {
        document.querySelector(".react-grid-Canvas").scrollTop = document.querySelector(
          ".react-grid-Canvas"
        ).scrollHeight;
        this.setState({ firstLoad: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", () =>
      this.setState({ height: window.innerHeight - heightOffset })
    );
  }

  getPaintSchedule() {
    const self = this;

    const updateData = data => {
      self._rows = data.RoundData.slice();
      self.setState({
        rows: self._rows,
        initialRows: data.RoundData.slice(),
        roundSummary: data.summary,
        selectedRound: data.selectedRound
      });
    };
    DataService.getPaintSchedule()
      .then(updateData)
      .catch(err => {
        console.error(err);
      });
  }

  getStyleCodesAndProgramColors() {
    const self = this;
    const updateData = data => {
      self.setState({ styleCodes: data.programs.slice() });
    };
    DataService.GetStyleCodes()
      .then(updateData)
      .catch(err => {
        console.error(err);
      });

    DataService.GetColorCodes()
      .then(d => self.setState({ programColors: d.hash }))
      .catch(err => {
        console.error(err);
      });
  }
  getStyleCodePresets(styleCode) {
    for (let i = 0; i < this.state.styleCodes.length; i++) {
      if (this.state.styleCodes[i].id === styleCode) {
        return update(this.state.styleCodes[i], { $merge: {} });
      }
    }
    return {};
  }

  getProgramColors(styleCode) {
    return this.state.programColors[styleCode];
    const styleMetaData = this.getStyleCodePresets(styleCode);
    const colorChangeProgram = styleMetaData.color_change_program;
    const programColors = [];

    for (let i = 0; i < this.state.programColors.length; i++) {
      if (this.state.programColors[i].style_code === styleCode) {
        programColors.push(this.state.programColors[i]);
      }
      if (parseInt(this.state.programColors[i].style_code, 10) > parseInt(styleCode, 10)) break;
    }

    return programColors;
  }

  updatePaintSchedule(data) {
    this._rows = data.RoundData.slice();
    this.setState({
      rows: this._rows,
      initialRows: data.RoundData.slice(),
      roundSummary: data.summary,
      selectedRound: data.selectedRound
    });
  }

  handleResize = e => {
    this.setState({ height: window.innerHeight - heightOffset });
  };

  deleteRow = (e, data) => {
    const rowIdx = data.rowIdx;
    const rows = this.state.rows;

    let temp = rows[rowIdx].id.includes("TEMP");

    const deletedRow = this.state.rows[rowIdx];

    temp = update(deletedRow, { $merge: { action: "DELETE" } });
    const hash = "{0}:{1}:{2}"
      .formatUnicorn(deletedRow.id, JSON.stringify({ action: "DELETE" }), JSON.stringify(temp))
      .hashCode()
      .toString();

    this.persistRow(hash, temp);
    /*
    changedRows.push(update(deletedRow, {$merge: {action: "DELETE"}}));


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
    } */
  };
  insertRowAbove(e, data) {
    this.insertRow(data.rowIdx);
  }
  insertRowBelow(e, data) {
    this.insertRow(data.rowIdx + 1);
  }
  insertRow(rowIdx2) {
    if (this.state.insertingRow) return;
    this.setState({ insertingRow: true });

    const rows = this.state.rows;
    const length = rows.length;
    const lastRow = rowIdx2 === length;
    const rowIdx = lastRow ? rowIdx2 - 1 : rowIdx2;

    const currentRound = parseInt(rows[rowIdx].round, 10);
    const currentPos = parseInt(rows[rowIdx].round_position, 10);
    const newRows = this.state.newRows;

    for (let i = rowIdx; i < rows.length; i++) {
      if (
        parseInt(rows[i].round, 10) === currentRound &&
        parseInt(rows[i].round_position, 10) >= currentPos
      ) {
        rows[i].round_position = (parseInt(rows[i].round_position, 10) + 1).toString();
      }
    }

    const newRow = {
      id: `TEMP-ID-${this.state.newRows}`,
      round: currentRound,
      round_position: lastRow ? currentPos + 1 : currentPos,
      color: "",
      notes: ""
    };
    rows.splice(rowIdx2, 0, newRow);
    this.setState({ rows, newRows: newRows + 1 });
  }
  handleRowUpdated(e) {
    // merge updated row with current row and rerender by setting state
    const rows = update(this.state.rows, { $merge: {} });
    const tempRows = update(rows, { $merge: {} });
    tempRows[e.rowIdx] = update(tempRows[e.rowIdx], { $merge: e.updated });
    const changed = update(this.state.changedRows, { $merge: {} });

    if (rows[e.rowIdx][e.cellKey] !== e.updated[e.cellKey]) {
      if (e.cellKey === "style_code") {
        const style_metadata = this.getStyleCodePresets(e.updated[e.cellKey]);
        const new_rowdata = {
          style_code: style_metadata.style_code,
          assembly_flow: style_metadata.assembly_flow,
          customer: style_metadata.customer,
          program: style_metadata.style_name
        };
        tempRows[e.rowIdx] = update(tempRows[e.rowIdx], { $merge: new_rowdata });
      }
      // get last changes
      const changed_row = tempRows[e.rowIdx];
      const previous_changedRowIdx = this.rowPreviouslyChanged(changed_row.id);

      if (previous_changedRowIdx === -1) {
        changed.push(update(changed_row, { $merge: { action: "UPDATE" } }));
      } else {
        changed[previous_changedRowIdx] = update(changed[previous_changedRowIdx], {
          $merge: tempRows[e.rowIdx]
        });
      }

      if (this.applyRuleSet(tempRows)) {
        rows[e.rowIdx] = update(rows[e.rowIdx], { $merge: tempRows[e.rowIdx] });
        this.setState({ rows, changedRows: changed });
      } else {
        console.log("failed pass ruleset");
      }
    }
  }
  handleRowUpdateFailed() {}
  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    if (fromRow !== toRow) return;

    const rows = this.state.rows.slice();
    const changedRows = this.state.changedRows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      var changed = false;
      const rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      Object.keys(updated).map((key, idx) => {
        if (rowToUpdate[key] !== updatedRow[key]) changed = true;
      });

      if (changed) {
        if (updated.style_code) {
          const style_metadata = this.getStyleCodePresets(updated.style_code);
          const new_rowdata = {
            assembly_flow: style_metadata.assembly_flow,
            customer: style_metadata.customer,
            program: style_metadata.description,
            pieces: style_metadata.PartsPerCarrier ? style_metadata.PartsPerCarrier : 0,
            mold_wip_density: style_metadata.mold_wip_rack_density,
            total_crs: 1,
            total_pcs: 1 * style_metadata.PartsPerCarrier
          };
          updatedRow = update(updatedRow, { $merge: new_rowdata });
        }

        /*
        var previous_changedRowIdx = this.rowPreviouslyChanged(updatedRow.id);
        if(previous_changedRowIdx == -1){
          if(updatedRow.id.includes("TEMP")){
            changedRows.push(update(updatedRow, {$merge: {action:"INSERT"}}));
          }else{
            changedRows.push(update(updatedRow, {$merge: {action:"UPDATE"}}));
          }
        }else{
          changedRows[previous_changedRowIdx] = update(changedRows[previous_changedRowIdx], {$merge: updated});
        }
        */
        if (updatedRow.id.includes("TEMP")) {
          if (
            !updatedRow.style_code ||
            !(parseInt(updatedRow.pieces, 10) >= 0) ||
            !updatedRow.program ||
            !updatedRow.round ||
            !(parseInt(updatedRow.total_crs, 10) >= 0) ||
            !(parseInt(updatedRow.total_pcs, 10) >= 0) ||
            updatedRow.customer == undefined ||
            !(parseInt(updatedRow.mold_wip_density, 10) >= 0) ||
            !updatedRow.round_position
          ) {
            rows[i] = updatedRow;
            this.setState({ rows });
          } else {
            var temp = update(updatedRow, { $merge: { action: "INSERT" } });
            var hash = "{0}:{1}:{2}"
              .formatUnicorn(updatedRow.id, JSON.stringify(updated), JSON.stringify(temp))
              .hashCode()
              .toString();
            this.persistRow(hash, temp);
          }
        } else {
          var temp = update(updatedRow, { $merge: { action: "UPDATE" } });
          var hash = "{0}:{1}:{2}"
            .formatUnicorn(updatedRow.id, JSON.stringify(updated), JSON.stringify(temp))
            .hashCode()
            .toString();
          this.persistRow(hash, temp);
        }
        // rows[i] = updatedRow;
      }
    }

    // this.setState({ rows: rows, changedRows: changedRows });
  };
  handleCellSelect(selected) {
    this.setState({ selectedRound: this.state.rows[selected.rowIdx].round });
  }
  persistNewRow(e, data) {
    console.log("very persistent ;)");
  }
  persistRow(hash, row) {
    let url = "../paint.asmx/UpdatePaintSchedule";
    if (this.state.env === "development") url = "../paint.asmx/UpdatePaintScheduleTest";
    const updateq = Object.assign({}, this.state.queuedUpdates);

    if (updateq[hash]) return;
    updateq[hash] = 1;

    this.setState({ queuedUpdates: updateq });

    DataService.UpdatePaintSchedule(row);
    $.ajax({
      method: "POST",
      url,
      data: JSON.stringify({ ss: [row] }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success(msg) {
        const data = JSON.parse(msg.d);
        const updateq2 = Object.assign({}, this.state.queuedUpdates);
        updateq2[hash] = 0;
        delete updateq2[hash];
        this.setState({ queuedUpdates: updateq2, insertingRow: false });
        this.getPaintSchedule();
      },
      error(request, status, error) {
        console.log(error);
      }
    });
  }
  rowPreviouslyChanged(key) {
    const result = this.state.changedRows.findIndex((value, index, obj) => {});
    for (let i = 0; i < this.state.changedRows.length; i++) {
      if (this.state.changedRows[i].id === key) return i;
    }
    return -1;
  }
  addNewRound() {
    let question = "Add new round?";

    let url = "../paint.asmx/ScheduleNewRoundTest";
    if (this.state.env === "development") url = "../paint.asmx/ScheduleNewRoundTest";

    if (this.state.newRows > 0) question = "Unsaved rows will be lost! Continue?";

    if (true) {
      // }    if(confirm(string)){
      $.ajax({
        method: "POST",
        url,
        data: JSON.stringify({
          selectedDate: this.state.selectedDate
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success(msg) {
          const data = JSON.parse(msg.d);
          const roundData = data[0] || [];
          const roundSummary = {};
          if (data[1]) {
            for (let i = 0; i < data[1].length; i++) {
              roundSummary[data[1][i].round] = data[1][i];
            }
          }

          this.setState({
            rows: roundData.slice(),
            initialRows: roundData.slice(),
            roundSummary,
            selectedRound: data[1][data[1].length - 1].round
          });
        },
        error(request, status, error) {
          console.log(error);
        }
      });
    }
  }
  applyRuleSet(newTable) {
    console.log("apply rule set");
    // var tableCopy = update(newTable, {$merge:{}});
    // var Results = [];
    // for(var i = 0; i < RuleSet.rules.length; i++){
    //  var currentRule = RuleSet.rules[i];
    //  for(var j = 0; j < tableCopy.length - 1; j++){
    //    var thisRow = tableCopy[j], nextRow = tableCopy[j+1];
    //      if(!currentRule.check(thisRow, nextRow)) return false;
    //  }
    // }
    return true;
  }
  reset() {
    console.log("reset");
    if (this.state.changedRows.length > 0) {
      this.setState({
        rows: this.state.initialRows.slice(),
        changedRows: [],
        selectedIds: [],
        numSelected: 0,
        newRows: 0
      });
    }
  }
  rowGetter = idx => {
    return this.state.rows[idx];
  };

  render() {
    const { numSelected } = this.state;

    // Columns definition
    /* eslint-disable */
    const columns = [
      { key: "round", name: "Round", width: 65, editable: false },
      { key: "style_code", name: "StyleCode", width: 90, editable: true },
      { key: "pieces", name: "PPC", width: 50, editable: true },
      { key: "assembly_flow", name: "AssemblyFlow", width: 125, editable: true },
      { key: "program", name: "Program", editable: true, width: 125 },
      { key: "mold_skin_style", name: "MoldSkin/Style", editable: true, width: 225 },
      { key: "notes", name: "Notes", width: 250, editable: true, formatter: NotesFormatter },
      { key: "rework_color_chart", name: "ReworkColorChart", editable: true, width: 200 },
      { key: "color", name: "Color", editable: true, width: 125 },
      { key: "add_take_off", name: "ATO", width: 50, editable: true },
      { key: "total_crs", name: "TotalCrs", width: 75, editable: true },
      { key: "total_pcs", name: "TotalPcs", width: 90, editable: true },
      { key: "customer", name: "Customer", editable: true, width: 100 },
      { key: "crs_real_time", name: "CarriersRealTime", width: 150, editable: true },
      { key: "mold_wip_density", name: "WIPDensity", width: 110, editable: true },
      { key: "loc", name: "WIPLocation", width: 200, editable: true },
      { key: "assy_build_option", name: "BuildOption", width: 150, editable: true }
    ];
    /* eslint-enable */

    return (
      <div className="rdg">
        <RoundSummary round={this.state.selectedRound} roundSummary={this.state.roundSummary} />
        <ReactDataGrid
          contextMenu={
            <PaintScheduleEditorContextMenu
              id="customizedContextMenu"
              multipleSelected={numSelected > 0}
              newRows={this.state.newRows > 0}
              onRowDelete={this.deleteRow}
              onRowInsertAbove={this.insertRowAbove}
              onRowInsertBelow={this.insertRowBelow}
              onPersistNewRow={this.persistNewRow}
              minHeight={500}
            />
          }
          enableCellSelect={true}
          onCellSelected={cell =>
            this.setState({ selectedRound: this.state.rows[cell.rowIdx].round })
          }
          columns={columns}
          rowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={this.state.height}
          onGridRowsUpdated={() => this.handleGridRowsUpdated}
          rowRenderer={<RowRenderer getProgramColors={idx => this.state.programColors[idx]} />}
        />

        <ReactiveBtn clickEvent={this.addNewRound} text="New Round" />
      </div>
    );
  }
}
PaintScheduleEditor.defaultProps = {
  rowKey: "id",
  ruleSet: {}
};
PaintScheduleEditor.propTypes = {
  rowKey: PropTypes.string,
  ruleSet: PropTypes.object
};
