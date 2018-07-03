import React, { Component } from "react";
import update from "react-addons-update";
import PropTypes from "prop-types";
import Columns from "./Columns";
import { RoundSummary } from "./RoundSummary";
import DataService from "../api/DataService";
import AlertDismissable from "./AlertDismissable";
import SettingsModal from "./SettingsModal";
import classnames from "classnames";
import { Add } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { headers } from "./TableConfig";
import EditableRow from "./EditableRow";
import {
  Button, 
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableRow,
  Paper} from "@material-ui/core";

const ReactiveButton = ({ numChanged, clickEvent, text }) => (
  <Button onClick={clickEvent} variant="fab" color="primary" aria-label="add">
    <Add />
    {text}
  </Button>
);
ReactiveButton.propTypes = {
  numChanged: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  clickEvent: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  text: PropTypes.string
};
const heightOffset = 250;

const onAfterInsertRow = (row) => {
  debugger;
};

const onAfterDeleteRow = (rowKeys) => {};
function afterSearch(searchText, result) {
  if (!searchText) {
    console.log("Nothing to search for");
    return;
  }
  console.log("Your search text is " + searchText);
  console.log("Result is:");
  for (let i = 0; i < result.length; i++) {
    console.log(
      "Fruit: " + result[i].id + ", " + result[i].name + ", " + result[i].price
    );
  }
}
const options = {
  defaultSortName: "mold_skin_style",
  defaultSortOrder: "desc",
  sortIndicator: false, // disable sort indicator,
  afterInsertRow: onAfterInsertRow,
  afterDeleteRow: onAfterDeleteRow,
  onRowClick: (row) => {},
  onRowDoubleClick: (row) => {},
  afterSearch: afterSearch // define a after search hook
};

export default class PaintScheduleEditor2 extends Component {
  constructor(props, context) {
    super(props, context);
    this._rows = [];
    this.lastSelected = null;
    this.state = {
      selected: [],
      selectedRow: null,
      msg: {
        show: false,
        text: "",
        title: ""
      },
      editing: false,
      showSettings: false,
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
    this.showSettings.bind(this);
    this.onEditorClosed = this.onEditorClosed.bind(this);
    this.updateData = this.updateData.bind(this);
    this.undoSelection = this.undoSelection.bind(this);
  } 
   
  componentDidMount() {
    this.getPaintSchedule();
    this.getStyleCodesAndProgramColors();
    window.addEventListener("resize", () =>
      this.setState({ height: window.innerHeight - heightOffset })
    );
  }
  componentDidUpdate() {
    if (this.state.firstLoad) {
      if (this.state.rows.length > 0) {
        this.setState({ firstLoad: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", () =>
      this.setState({ height: window.innerHeight - heightOffset })
    );
  }

  updateData(data) {
    this._rows = data.RoundData.slice();
    this.setState({
      rows: this._rows,
      initialRows: data.RoundData.slice(),
      roundSummary: data.summary,
      selectedRound: data.selectedRound
    });
  }
  getPaintSchedule() {
    const self = this;

    DataService.getPaintSchedule()
      .then(this.updateData)
      .catch((err) => {
        console.error(err);
      });
  }

  getStyleCodesAndProgramColors() {
    const self = this;
    const updateData = (data) => {
      self.setState({ styleCodes: data.programs.slice() });
    };
    DataService.GetStyleCodes()
      .then(updateData)
      .catch((err) => {
        console.error(err);
      });

    DataService.GetColorCodes()
      .then((d) => self.setState({ programColors: d.hash }))
      .catch((err) => {
        console.error(err);
      });
  }
  getStyleCodePresets(styleCode) {
    let result = this.state.styleCodes.find((code) => code.id === styleCode);
    if (result != null) return update(result, { $merge: {} });
    return {};
  }

  getProgramColors(styleCode) {
    return this.state.programColors[styleCode];
    /**
    const styleMetaData = this.getStyleCodePresets(styleCode);
    const colorChangeProgram = styleMetaData.color_change_program;
    const programColors = [];

    for (let i = 0; i < this.state.programColors.length; i++) {
      if (this.state.programColors[i].style_code === styleCode) {
        programColors.push(this.state.programColors[i]);
      }
      if (
        parseInt(this.state.programColors[i].style_code, 10) >
        parseInt(styleCode, 10)
      )
        break;
    }

    return programColors; */
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

  handleResize = (e) => {
    this.setState({ height: window.innerHeight - heightOffset });
  };

  deleteRow = (e, data) => {
    const rowIdx = data.rowIdx;
    const rows = this.state.rows;

    let temp = rows[rowIdx].id.includes("TEMP");

    const deletedRow = this.state.rows[rowIdx];

    temp = update(deletedRow, { $merge: { action: "DELETE" } });
    const hash = "{0}:{1}:{2}"
      .formatUnicorn(
        deletedRow.id,
        JSON.stringify({ action: "DELETE" }),
        JSON.stringify(temp)
      )
      .hashCode()
      .toString();

    this.persistRow(hash, temp);
    this.setState({ msg: { show: true } });
    console.log("show have deleted row");
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
        rows[i].round_position = (
          parseInt(rows[i].round_position, 10) + 1
        ).toString();
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
        tempRows[e.rowIdx] = update(tempRows[e.rowIdx], {
          $merge: new_rowdata
        });
      }
      // get last changes
      const changed_row = tempRows[e.rowIdx];
      const previous_changedRowIdx = this.rowPreviouslyChanged(changed_row.id);

      if (previous_changedRowIdx === -1) {
        changed.push(update(changed_row, { $merge: { action: "UPDATE" } }));
      } else {
        changed[previous_changedRowIdx] = update(
          changed[previous_changedRowIdx],
          {
            $merge: tempRows[e.rowIdx]
          }
        );
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

    for (let i = fromRow; i <= toRow; i++) {
      var changed = false;
      const rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });
      debugger;
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
            pieces: style_metadata.PartsPerCarrier
              ? style_metadata.PartsPerCarrier
              : 0,
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
              .formatUnicorn(
                updatedRow.id,
                JSON.stringify(updated),
                JSON.stringify(temp)
              )
              .hashCode()
              .toString();
            this.persistRow(hash, temp);
          }
        } else {
          var temp = update(updatedRow, { $merge: { action: "UPDATE" } });
          var hash = "{0}:{1}:{2}"
            .formatUnicorn(
              updatedRow.id,
              JSON.stringify(updated),
              JSON.stringify(temp)
            )
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
    let url =
      this.state.env === "development"
        ? "../paint.asmx/UpdatePaintScheduleTest"
        : "../paint.asmx/UpdatePaintSchedule";

    const updateq = Object.assign({}, this.state.queuedUpdates);

    if (updateq[hash]) return;
    updateq[hash] = 1;

    this.setState({ queuedUpdates: updateq });

    let newRow = DataService.UpdatePaintSchedule(row);
    DataService.UpdateRow(row)
      .then((o) => {
        debugger;
      })
      .catch((error) => {});
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
    if (this.state.env === "development")
      url = "../paint.asmx/ScheduleNewRoundTest";

    if (this.state.newRows > 0)
      question = "Unsaved rows will be lost! Continue?";

    if (true) {
      // }    if(confirm(string)){
      DataService.AddRound(this.state.selectedDate)
        .then((o) => {
          debugger;
        })
        .catch((error) => {
          debugger;
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
  rowGetter = (idx) => {
    return this.state.rows[idx];
  };
  showSettings(e) {
    this.setState({ showSettings: true });
  }

  getRowFormat(row, index) {
    const rowStyle = classnames({
      "bg-success": row.id.substring(0, 4) === "TEMP",
      "bg-normal": row.id.substring(0, 4) !== "TEMP",
      service: row.color && row.color.includes("service"),
      dontship: row.notes && row.notes.includes("do not ship"),
      shipifgood: row.notes && row.notes.includes("ship if good"),
      build: row.notes && row.notes.includes("build")
    });
    let result = [];
    result.push(row.id.substring(0, 4) === "TEMP" ? "bg-success" : "bg-normal");
    if (row.color && /service/i.test(row.color)) result.push("service");

    if (row.notes) {
      if (/do not ship/i.test(row.notes)) result.push("dontship");

      if (/ship if good/i.test(row.notes)) result.push("shipifgood");

      if (/build/i.test(row.notes)) result.push("build");
    }
    return result;
  }

  undoSelection() {
    this.lastSelected = null;
  }
  onRowSelected(e, id, row) {
    if (this.lastSelected == row) {
      this.setState({ editing: true, selectedRow: row });
    } else {
      this.lastSelected = row;

      setInterval(this.undoSelection, 1500);
    }

    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  }
  isSelected = (id) => this.state.selected.indexOf(id) !== -1;
  onEditorClosed(cancelled, row) {
    this.setState({ editing: false });
  }
  render() {
    const { numSelected } = this.state;

    // Columns definition

    /* eslint-enable */

    return (
      <div className="rdg">
        <EditableRow
          open={this.state.editing}
          row={this.state.selectedRow}
          onClosed={this.onEditorClosed}
        />
        <SettingsModal show={this.state.showSettings} />
        <AlertDismissable
          title={this.state.msg.title}
          text={this.state.msg.Text}
          show={this.state.msg.show}
        />
        <Paper>
          <RoundSummary
            round={this.state.selectedRound}
            roundSummary={this.state.roundSummary}
            onClick={() => this.showSettings(this)}
          />
          <Table aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                {headers.map((header, idx) => (
                  <TableCell
                    padding={header.padding}
                    key={"header-" + idx}
                    style={{ width: header.width }}>
                    {header.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.map((row, row_idx) => {
                const isSelected = this.isSelected(row_idx);
                return (
                  <TableRow
                    key={"row-" + row_idx}
                    selected={isSelected}
                    hover
                    onClick={(event) =>
                      this.onRowSelected(event, row_idx, row)
                    }>
                    {headers.map((header, idx) => {
                      return (
                        <TableCell
                          padding={header.padding}
                          key={"cell-" + idx}
                          width={header.width}>
                          {row[header.value]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        <ReactiveButton clickEvent={this.addNewRound} text="New Round" />
      </div>
    );
  }
}
PaintScheduleEditor2.defaultProps = {
  rowKey: "id",
  ruleSet: {}
};
PaintScheduleEditor2.propTypes = {
  rowKey: PropTypes.string,
  ruleSet: PropTypes.object,
  isConnected: PropTypes.bool
};
