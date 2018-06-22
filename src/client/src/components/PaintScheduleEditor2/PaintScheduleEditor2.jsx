import * as $ from "jquery";

import React, { Component } from "react";
import update from "react-addons-update";
import PropTypes from "prop-types";
import Columns from "./Columns";
import ReactiveBtn from "./ReactiveBtn";
import { RoundSummary } from "./RoundSummary";
import DataService from "../../api/DataService";
import AlertDismissable from "../AlertDismissable";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Modal, Button, ButtonToolbar } from "react-bootstrap";

const heightOffset = 250;

const selectRowProp = {
  mode: "radio",
  bgColor: "pink", // you should give a bgcolor, otherwise, you can't regonize which row has been selected
  hideSelectColumn: true, // enable hide selection column.
  clickToSelect: true, // you should enable clickToSelect, otherwise, you can't select column.
  showOnlySelected: true
};

const cellEditProp = {
  mode: "dbclick",
  blurToSave: true
};

const onAfterInsertRow = row => {
  debugger;
};

const onAfterDeleteRow = rowKeys => {};
function afterSearch(searchText, result) {
  console.log("Your search text is " + searchText);
  console.log("Result is:");
  for (let i = 0; i < result.length; i++) {
    console.log("Fruit: " + result[i].id + ", " + result[i].name + ", " + result[i].price);
  }
}
const options = {
  defaultSortName: "mold_skin_style",
  defaultSortOrder: "desc",
  sortIndicator: false, // disable sort indicator,
  afterInsertRow: onAfterInsertRow,
  afterDeleteRow: onAfterDeleteRow,
  onRowClick: row => {},
  onRowDoubleClick: row => {},
  afterSearch: afterSearch // define a after search hook
};

const defaultOptions = {
  defaultSortName: "mold_skin_style",
  defaultSortOrder: "desc",
  sortIndicator: false, // disable sort indicator,
  afterInsertRow: onAfterInsertRow,
  afterDeleteRow: onAfterDeleteRow,
  onRowClick: row => {},
  onRowDoubleClick: row => {},
  afterSearch: afterSearch // define a after search hook
};

class SettingsModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleHid = this.handleHide.bind(this);
    this.state = { show: false };
  }
  handleShow() {
    this.setState({ show: true });
  }

  handleHide() {
    this.setState({ show: false });
  }
  render() {
    return (
      <ButtonToolbar>
        <Button bsStyle="primary" onClick={this.handleShow}>
          Launch demo modal
        </Button>

        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Wrapped Text</h4>
            <p>
              Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde commodi
              aspernatur enim, consectetur. Cumque deleniti temporibus ipsam atque a dolores
              quisquam quisquam adipisci possimus laboriosam. Quibusdam facilis doloribus debitis!
              Sit quasi quod accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
              reiciendis porro quo magni incidunt dolore amet atque facilis ipsum deleniti rem!
              Dolores debitis voluptatibus ipsum dicta. Dolor quod amet ab sint esse distinctio
              tenetur. Veritatis laudantium quibusdam quidem corporis architecto veritatis. Ex
              facilis minima beatae sunt perspiciatis placeat. Quasi corporis odio eaque
              voluptatibus ratione magnam nulla? Amet cum maiores consequuntur totam dicta!
              Inventore adipisicing vel vero odio modi doloremque? Vitae porro impedit ea minima
              laboriosam quisquam neque. Perspiciatis omnis obcaecati consequatur sunt deleniti
              similique facilis sequi. Ipsum harum vitae modi reiciendis officiis. Quas laudantium
              laudantium modi corporis nihil provident consectetur omnis, natus nulla distinctio
              illum corporis. Sit ex earum odio ratione consequatur odit minus laborum? Eos? Sit
              ipsum illum architecto aspernatur perspiciatis error fuga illum, tempora harum earum,
              a dolores. Animi facilis inventore harum dolore accusamus fuga provident molestiae
              eum! Odit dicta error dolorem sunt reprehenderit. Sit similique iure quae obcaecati
              harum. Eum saepe fugit magnam dicta aliquam? Sapiente possimus aliquam fugiat officia
              culpa sint! Beatae voluptates voluptatem excepturi molestiae alias in tenetur beatae
              placeat architecto. Sit possimus rerum fugiat sapiente aspernatur. Necessitatibus
              tempora animi dicta perspiciatis tempora a velit in! Doloribus perspiciatis doloribus
              suscipit nam earum. Deleniti veritatis eaque totam assumenda fuga sapiente! Id
              recusandae. Consectetur necessitatibus eaque velit nobis aliquid? Fugit illum qui
              suscipit aspernatur alias ipsum repudiandae! Quia omnis quisquam dignissimos a
              mollitia. Suscipit aspernatur eum maiores repellendus ipsum doloribus alias voluptatum
              consequatur. Consectetur quibusdam veniam quas tenetur necessitatibus repudiandae? Rem
              optio vel alias neque optio sapiente quidem similique reiciendis tempore. Illum
              accusamus officia cum enim minima eligendi consectetur nemo veritatis nam nisi!
              Adipisicing nobis perspiciatis dolorum adipisci soluta architecto doloremque
              voluptatibus omnis debitis quas repellendus. Consequuntur assumenda illum commodi
              mollitia asperiores? Quis aspernatur consequatur modi veritatis aliquid at? Atque vel
              iure quos. Amet provident voluptatem amet aliquam deserunt sint, elit dolorem ipsa,
              voluptas? Quos esse facilis neque nihil sequi non? Voluptates rem ab quae dicta culpa
              dolorum sed atque molestias debitis omnis! Sit sint repellendus deleniti officiis
              distinctio. Impedit vel quos harum doloribus corporis. Laborum ullam nemo quaerat
              reiciendis recusandae minima dicta molestias rerum. Voluptas et ut omnis est ipsum
              accusamus harum. Amet exercitationem quasi velit inventore neque doloremque!
              Consequatur neque dolorem vel impedit sunt voluptate. Amet quo amet magni
              exercitationem libero recusandae possimus pariatur. Cumque eum blanditiis vel vitae
              distinctio! Tempora! Consectetur sit eligendi neque sunt soluta laudantium natus qui
              aperiam quisquam consectetur consequatur sit sint a unde et. At voluptas ut officiis
              esse totam quasi dolorem! Hic deserunt doloribus repudiandae! Lorem quod ab nostrum
              asperiores aliquam ab id consequatur, expedita? Tempora quaerat ex ea temporibus in
              tempore voluptates cumque. Quidem nam dolor reiciendis qui dolor assumenda ipsam
              veritatis quasi. Esse! Sit consectetur hic et sunt iste! Accusantium atque elit
              voluptate asperiores corrupti temporibus mollitia! Placeat soluta odio ad blanditiis
              nisi. Eius reiciendis id quos dolorum eaque suscipit magni delectus maxime. Sit odit
              provident vel magnam quod. Possimus eligendi non corrupti tenetur culpa accusantium
              quod quis. Voluptatum quaerat animi dolore maiores molestias voluptate? Necessitatibus
              illo omnis laborum hic enim minima! Similique. Dolor voluptatum reprehenderit nihil
              adipisci aperiam voluptatem soluta magnam accusamus iste incidunt tempore consequatur
              illo illo odit. Asperiores nesciunt iusto nemo animi ratione. Sunt odit similique
              doloribus temporibus reiciendis! Ullam. Dolor dolores veniam animi sequi dolores
              molestias voluptatem iure velit. Elit dolore quaerat incidunt enim aut distinctio.
              Ratione molestiae laboriosam similique laboriosam eum et nemo expedita. Consequuntur
              perspiciatis cumque dolorem.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
}

export default class PaintScheduleEditor2 extends Component {
  constructor(props, context) {
    super(props, context);
    this._rows = [];
    this.state = {
      msg: {
        show: false,
        text: "",
        title: ""
      },
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
    let url =
      this.state.env === "development"
        ? "../paint.asmx/UpdatePaintScheduleTest"
        : "../paint.asmx/UpdatePaintSchedule";

    const updateq = Object.assign({}, this.state.queuedUpdates);

    if (updateq[hash]) return;
    updateq[hash] = 1;

    this.setState({ queuedUpdates: updateq });

    let newRow = DataService.UpdatePaintSchedule(row);
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
  showSettings() {
    debugger;
    this.setState({ showSettings: true });
  }
  render() {
    const { numSelected } = this.state;

    // Columns definition

    /* eslint-enable */

    return (
      <div className="rdg">
        <SettingsModal show={this.state.showSettings} />
        <AlertDismissable
          title={this.state.msg.title}
          text={this.state.msg.Text}
          show={this.state.msg.show}
        />

        <RoundSummary
          round={this.state.selectedRound}
          roundSummary={this.state.roundSummary}
          onClick={this.showSettings}
        />
        <BootstrapTable
          insertRow={true}
          data={this.state.rows}
          striped
          hover
          options={options}
          selectRow={selectRowProp}
          deleteRow={true}
          search={true}
          multiColumnSearch={true}
          cellEdit={cellEditProp}
          pagination
        >
          {Columns.map(
            ({ isKey, key, width, dataAlign, name, dataSort, hidden, editable, customEditor }) => (
              <TableHeaderColumn
                search={true}
                editable={editable}
                isKey={isKey}
                dataSort={dataSort}
                dataField={key}
                width={width}
                dataAlign={dataAlign}
                hidden={hidden}
                customEditor={customEditor}
                keyBoardNav
              >
                {name}
              </TableHeaderColumn>
            )
          )}
        </BootstrapTable>

        <ReactiveBtn clickEvent={this.addNewRound} text="New Round" />
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
  ruleSet: PropTypes.object
};
