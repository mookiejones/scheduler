import React, { Component, Fragment } from 'react';
import update from 'immutability-helper';
import Fetch, { options } from '../../shared/DataFetcher';
import columns from './PaintScheduleEditorColumns';
import RowRenderer from './RowRenderer';
import PaintScheduleEditorContextMenu from './PaintScheduleEditorContextMenu';
import LoadingIcon from './LoadingIcon';
import TopSection from './TopSection';
import PropTypes from 'prop-types';
import SettingsDialog from './SettingsDialog';
import RowColorRule from './RowColorRule';

import { URLS, Actions } from '../../shared';
import AddNewRoundButton from './AddNewRoundButton';

import RoundDataItem from './RoundDataItem';

import { withAlert } from 'react-alert';

const debug = require('debug')('PaintScheduleEditor');

const ReactDataGrid = require('react-data-grid');

const { Toolbar } = require('react-data-grid-addons');

const heightOffset = 250;

const convertItems = (items) =>
  items.map((o) => {
    o.contains = o.contains === 1;
    return o;
  });
class PaintScheduleEditor extends Component {
  constructor(props) {
    super(props);

    this.env = props.env;

    this.state = {
      isMounted: false,

      changedRows: [],
      expandedRows: {},
      firstLoad: true,
      groupBy: [],
      height: window.innerHeight - heightOffset,
      initialRows: [],
      loaded: false,
      newRows: 0,
      numSelected: 0,
      programColors: [],
      queuedUpdates: {},
      roundSummary: [],
      rows: [],
      rules: [],
      selectedIds: [],
      selectedRound: -1,
      selectedRounds: [],
      showSettings: false,
      styleCodes: []
    };

    this.handleAddColorRule = this.handleAddColorRule.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.addNewRound = this.addNewRound.bind(this);
    this.insertRowAbove = this.insertRowAbove.bind(this);
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
    this.onCellSelected = this.onCellSelected.bind(this);
    this.onUpdateColors = this.onUpdateColors.bind(this);
    this.rowGetter = this.rowGetter.bind(this);
    this.getProgramColors = this.getProgramColors.bind(this);
    this.onGotPaintSchedule = this.onGotPaintSchedule.bind(this);
    this.persistRow = this.persistRow.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleSettingsClick = this.handleSettingsClick.bind(this);
    this.onUpdateColorRules = this.onUpdateColorRules.bind(this);
    this.onAddedNewRound = this.onAddedNewRound.bind(this);
    this.insertRowBelow = this.insertRowBelow.bind(this);
    this.handleCommitRule = this.handleCommitRule.bind(this);
    this.onUpdatedRules = this.onUpdatedRules.bind(this);
    this.handleDeleteColorRule = this.handleDeleteColorRule.bind(this);
    debug('Creating');
  }

  componentDidMount() {
    this.getPaintSchedule();
    this.getStyleCodesAndProgramColors();
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Component Will Unmount
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { firstLoad, rows } = this.state;

    if (!firstLoad) return;

    if (rows.length > 0) {
      let element = document.querySelector('.react-grid-Canvas');
      if (!element) return;
      element.scrollTop = element.scrollHeight;
      this.setState({ firstLoad: false });
    }
  }

  handleResize(e) {
    this.setState({ height: window.innerHeight - heightOffset });
  }

  /**
   *
   * @param {Object} data
   */
  onUpdatePaintSchedule(data) {
    var roundData = data[0] || [];
    var roundSummaryData = data[1] || [];
    var selectedRound;
    if (roundSummaryData.length > 0) {
      selectedRound = roundSummaryData[roundSummaryData.length - 1]['round'];
    } else {
      selectedRound = null;
    }
    var roundSummary = {};
    if (data[1]) {
      for (var i = 0; i < data[1].length; i++) {
        roundSummary[data[1][i]['round']] = data[1][i];
      }
    }

    this.setState({
      rows: roundData.slice(),
      initialRows: roundData.slice(),
      roundSummary: roundSummary,
      selectedRound: selectedRound
    });
  }

  onGotPaintSchedule(data) {
    var roundData = (data[0] || []).map((o) => new RoundDataItem(o));

    var roundSummaryData = data[1] || [];

    let selectedRound = null;

    /** If Selected round is returned as a string, then convert to an integer */
    if (roundSummaryData.length > 0) {
      selectedRound = roundSummaryData[roundSummaryData.length - 1]['round'];
      if (typeof selectedRound === 'string')
        selectedRound = parseInt(selectedRound, 10);
    }

    var roundSummary = {};
    if (data[1]) {
      for (let i of data[1]) {
        roundSummary[i['round']] = i;
      }
    }

    const result = {
      rows: roundData.slice(),
      initialRows: roundData.slice(),
      roundSummary: roundSummary,
      selectedRound: selectedRound,
      loaded: true
    };

    this.setState(result);
  }

  getPaintSchedule(dateStr) {
    const url = `GetPaintSchedule`;

    this.setState({ loaded: false });

    Fetch(url, this.env)
      .then(this.onGotPaintSchedule)
      .catch(this.LogError);
  }

  onUpdateColors(data) {
    var hash = {};

    for (let item of data) {
      const style_code = item.style_code;
      if (style_code === null) continue;
      if (!hash[style_code]) {
        hash[style_code] = [];
      }
      hash[style_code].push({
        id: item.color_code,
        title: item.color_desc
      });
    }

    this.setState({ programColors: hash });
  }

  onUpdateColorRules(data) {
    let rules = data.map((d) => new RowColorRule(d));
    this.setState({ rules: rules });
  }

  /**
   * get Style Codes and Program Colors
   */
  getStyleCodesAndProgramColors() {
    const { env } = this.props;

    Fetch(URLS.GetPaintScheduleStyles, env)
      .then((data) => this.setState({ styleCodes: data.slice() }))
      .catch(Fetch.ErrorHandler);

    Fetch(URLS.GetProgramColorsForScheduler, env)
      .then(this.onUpdateColors)
      .catch(Fetch.ErrorHandler);

    Fetch(URLS.GetColorRules, env)
      .then(this.onUpdateColorRules)
      .catch(Fetch.ErrorHandler);
  }

  /**
   * Get StyleCodePresets
   * @param {*} style_code
   */
  getStyleCodePresets(style_code) {
    debugger;
    for (var i = 0; i < this.state.styleCodes.length; i++) {
      if (this.state.styleCodes[i].id === style_code) {
        return update(this.state.styleCodes[i], { $merge: {} });
      }
    }
    return {};
  }

  /**
   *
   * @param {*} style_code
   */
  getProgramColors(style_code) {
    const { programColors } = this.state;

    if (programColors.length > 0) {
      debugger;
    }

    return programColors[style_code];
  }

  /**
   * Gets Row for datagrid
   * @param {number} rowIdx
   */
  rowGetter(rowIdx) {
    const { rows } = this.state;
    return rows[rowIdx];
  }

  /**
   *
   * @param {*} e
   * @param {*} data
   */
  deleteRow(e, { rowIdx }) {
    const { rows } = this.state;

    // var temp1 = rows[rowIdx].id.includes('TEMP');

    var deletedRow = rows[rowIdx];

    var temp = update(deletedRow, { $merge: { action: 'DELETE' } });
    var hash = '{0}:{1}:{2}'
      .formatUnicorn(
        deletedRow.id,
        JSON.stringify({ action: 'DELETE' }),
        JSON.stringify(temp)
      )
      .hashCode()
      .toString();

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

  /**
   *
   * @param {*} e
   * @param {*} data
   */
  insertRowAbove(e, data) {
    this.insertRow(data.rowIdx);
  }

  /**
   *
   * @param {*} e
   * @param {*} data
   */
  insertRowBelow(e, data) {
    this.insertRow(data.rowIdx + 1);
  }

  /**
   *
   * @param {*} rowIdx2
   */
  insertRow(rowIdx2) {
    const { insertingRow, rows, newRows } = this.state;
    if (insertingRow) return;

    this.setState({ insertingRow: true });

    var length = rows.length;
    var lastRow = rowIdx2 === length;
    var rowIdx = lastRow ? rowIdx2 - 1 : rowIdx2;

    var currentRound = parseInt(rows[rowIdx].round, 10);
    var currentPos = parseInt(rows[rowIdx].round_position, 10);

    for (var i = rowIdx; i < rows.length; i++) {
      if (
        parseInt(rows[i].round, 10) === currentRound &&
        parseInt(rows[i].round_position, 10) >= currentPos
      ) {
        rows[i].round_position = (
          parseInt(rows[i].round_position, 10) + 1
        ).toString();
      }
    }

    var newRow = {
      id: `TEMP-ID-${newRows}`,
      round: currentRound,
      round_position: lastRow ? currentPos + 1 : currentPos,
      color: '',
      notes: ''
    };
    rows.splice(rowIdx2, 0, newRow);
    this.setState({ rows: rows, newRows: newRows + 1, insertingRow: false });
  }

  /**
   *
   * @param {*} e
   */
  handleRowUpdated(e) {
    //merge updated row with current row and rerender by setting state

    var rows = update(this.state.rows, { $merge: {} });
    var tempRows = update(rows, { $merge: {} });
    tempRows[e.rowIdx] = update(tempRows[e.rowIdx], { $merge: e.updated });
    var changed = update(this.state.changedRows, { $merge: {} });

    if (rows[e.rowIdx][e.cellKey] !== e.updated[e.cellKey]) {
      if (e.cellKey === 'style_code') {
        var style_metadata = this.getStyleCodePresets(e.updated[e.cellKey]);
        var new_rowdata = {
          style_code: style_metadata.style_code,
          assembly_flow: style_metadata.assembly_flow,
          customer: style_metadata.customer,
          program: style_metadata.style_name
        };
        tempRows[e.rowIdx] = update(tempRows[e.rowIdx], {
          $merge: new_rowdata
        });
      }
      //get last changes
      var changed_row = tempRows[e.rowIdx];
      var previous_changedRowIdx = this.rowPreviouslyChanged(changed_row.id);

      if (previous_changedRowIdx === -1) {
        changed.push(
          update(changed_row, { $merge: { action: Actions.Update } })
        );
      } else {
        changed[previous_changedRowIdx] = update(
          changed[previous_changedRowIdx],
          { $merge: tempRows[e.rowIdx] }
        );
      }

      if (this.applyRuleSet(tempRows)) {
        rows[e.rowIdx] = update(rows[e.rowIdx], { $merge: tempRows[e.rowIdx] });
        this.setState({ rows: rows, changedRows: changed });
      } else {
        console.log('failed pass ruleset');
      }
    }
  }
  /**
   *
   */
  handleRowUpdateFailed() {}

  /**
   *
   * @param {*} param0
   */
  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    // If Row Value hasnt changed then return
    if (fromRow !== toRow) return;

    let rows = this.state.rows.slice();
    //
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      let changed = Object.keys(updated).some((key) => {
        return rowToUpdate[key] !== updatedRow[key];
      });

      if (changed) {
        if (updated.style_code) {
          var style_metadata = this.getStyleCodePresets(updated.style_code);
          var new_rowdata = {
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
            changedRows.push(update(updatedRow, {$merge: {action:'INSERT'}}));
          }else{
            changedRows.push(update(updatedRow, {$merge: {action:'UPDATE'}}));
          }
        }else{
          changedRows[previous_changedRowIdx] = update(changedRows[previous_changedRowIdx], {$merge: updated});
        }
        */
        const TEMP_STRING = 'TEMP';

        const isUpdated = (row) => {
          return (
            !row['style_code'] ||
            !(parseInt(row['pieces'], 10) >= 0) ||
            !row['program'] ||
            !row['round'] ||
            !(parseInt(row['total_crs'], 10) >= 0) ||
            !(parseInt(row['total_pcs'], 10) >= 0) ||
            row['customer'] === undefined ||
            !(parseInt(updatedRow['mold_wip_density'], 10) >= 0) ||
            !row['round_position']
          );
        };

        let ACTION = Actions.Insert;
        if (updatedRow.id.includes(TEMP_STRING)) {
          if (isUpdated(updatedRow)) {
            rows[i] = updatedRow;
            this.setState({ rows: rows });
            return;
          }
        } else {
          ACTION = Actions.Update;
          this.setState({ scrollToRowIndex: toRow });
        }

        const temp = update(updatedRow, { $merge: { action: ACTION } });
        const hash = '{0}:{1}:{2}'
          .formatUnicorn(
            updatedRow.id,
            JSON.stringify(updated),
            JSON.stringify(temp)
          )
          .hashCode()
          .toString();
        this.persistRow(hash, temp);

        //rows[i] = updatedRow;
      }
    }

    //this.setState({ rows: rows, changedRows: changedRows });
  }

  /**
   *
   * @param {*} e
   * @param {*} data
   */
  persistNewRow(e, data) {
    debugger;
    console.log('very persistent ;)');
  }

  /**
   *
   * @param {*} msg
   */
  onPersistRow(hash) {
    debugger;
    const { queuedUpdates } = this.state;
    var updateq2 = Object.assign({}, queuedUpdates);
    updateq2[hash] = 0;
    delete updateq2[hash];
    this.setState({ queuedUpdates: updateq2, insertingRow: false });
    this.getPaintSchedule();
  }

  persistRow(hash, row) {
    const { alert } = this.props;
    const { queuedUpdates } = this.state;

    var updateq = Object.assign({}, queuedUpdates);

    if (updateq[hash]) return;
    updateq[hash] = 1;

    this.setState({ queuedUpdates: updateq });

    let body = { str: JSON.stringify(row) };
    Fetch(URLS.UpdatePaintSchedule, this.env, options(body))
      .then((data) => {
        alert.show(`Changed ${data.value} items`);
      })
      .catch(Fetch.ErrorHandler)
      .finally(() => {
        var updateq2 = Object.assign({}, queuedUpdates);
        updateq2[hash] = 0;
        delete updateq2[hash];
        this.setState({ queuedUpdates: updateq2, insertingRow: false });
        this.getPaintSchedule();
      });
  }

  rowPreviouslyChanged(key) {
    const { changedRows } = this.state;
    for (var i = 0; i < changedRows.length; i++) {
      if (changedRows[i].id === key) return i;
    }
    return -1;
  }

  /**
   * OnCellSelected
   */
  onCellSelected({ rowIdx }) {
    const { rows } = this.state;
    const round = rows[rowIdx].round;
    this.setState({ selectedRound: parseInt(round, 10) });
  }

  /**
   * Updates table when new round is added
   * @param {*} data
   */
  onAddedNewRound(data) {
    let roundData = data[0] || [];
    let roundSummary = {};

    if (data[1]) {
      data[1].forEach((item) => {
        roundSummary[item.round] = item;
      });
    }

    let selectedRound = data[1][data[1].length - 1]['round'];
    const result = {
      rows: roundData.slice(),
      initialRows: roundData.slice(),
      roundSummary: roundSummary,
      selectedRound: selectedRound
    };
    console.log(`rows: ${result.rows.length}`);
    this.setState(result);

    this.onGotPaintSchedule(data);
  }

  addNewRound() {
    const { env } = this.props;
    const { selectedDate } = this.state;

    this.setState({ loaded: false });
    Fetch(URLS.ScheduleNewRound, env, { selectedDate: selectedDate })
      .then(this.onGotPaintSchedule)
      .catch(this.logError);
  }

  logError(error) {
    debugger;
    console.error(error);
  }

  applyRuleSet(newTable) {
    debugger;
    //var tableCopy = update(newTable, {$merge:{}});
    //var Results = [];
    //for(var i = 0; i < RuleSet.rules.length; i++){
    //  var currentRule = RuleSet.rules[i];
    //  for(var j = 0; j < tableCopy.length - 1; j++){
    //    var thisRow = tableCopy[j], nextRow = tableCopy[j+1];
    //      if(!currentRule.check(thisRow, nextRow)) return false;
    //  }
    //}
    debugger;
    return true;
  }

  reset() {
    const { changedRows, initialRows } = this.state;
    if (!(changedRows.length > 0)) return;

    this.setState({
      rows: initialRows.slice(),
      changedRows: [],
      selectedIds: [],
      numSelected: 0,
      newRows: 0
    });
  }
  onCopyToNewRound(e, data) {
    debugger;
  }
  onCopyToEndOfRound(e, data) {
    debugger;
  }

  onDeleteSelectedRows(e, data) {
    debugger;
  }

  handleSettingsClick(e) {
    this.setState({ showSettings: !this.state.showSettings });
  }

  onCopySelectedAbove(e, data) {
    debugger;
  }
  onCopySelectedBelow(e, data) {
    debugger;
  }
  onColumnResize(e, i) {
    debugger;
  }

  onUpdatedRules(result) {
    // TODO Update user on number of items changed
    let rules = result.items.map((o) => {
      o.contains = o.contains === 1;
      return o;
    });
    this.props.alert.show(`Changed ${result.result.value} rules`);

    this.setState({ rules: rules });
  }

  handleAddColorRule() {
    Fetch('AddColorRule', this.env)
      .then((result) => {
        debugger;
        this.setState({ rules: convertItems(result.items) });
      })
      .catch((error) => {
        debugger;
      });
  }
  handleCommitRule(idx, value) {
    const { env } = this.props;

    let rules = update(this.state.rules, { [idx]: { $merge: value } });
    this.setState({ rules: rules });

    Fetch('UpdateColorRule', env, options({ rule: JSON.stringify(value.rule) }))
      .then(this.onUpdatedRules)
      .catch((error) => {
        debugger;
      });
  }
  handleDeleteColorRule(row, idx) {
    let rule = this.state.rules[idx.rowIdx];
    Fetch('DeleteColorRule', this.env, options({ rule: JSON.stringify(rule) }))
      .then((value) => {
        debugger;
        this.setState({ rules: convertItems(value.items) });
      })
      .catch((error) => {
        debugger;
      });
  }
  render() {
    const {
      height,
      loaded,
      newRows,
      roundSummary,
      numSelected,
      rows,
      rules,
      scrollToRowIndex,
      selectedRound,
      selectedRounds,
      showSettings
    } = this.state;

    /**
     * This creates styling for the rows
     */
    const styling = rules.map(
      ({ title, color }) =>
        `.${title}>div{ background-color:${color}!important;color:black;}`
    );

    const contextMenu = (
      <PaintScheduleEditorContextMenu
        id="paintScheduleEditor"
        multipleSelected={numSelected > 0}
        newRows={newRows > 0}
        onRowDelete={this.deleteRow}
        onRowInsertAbove={this.insertRowAbove}
        onRowInsertBelow={this.insertRowBelow}
        onPersistNewRow={this.persistNewRow}
        onCopySelectedBelow={this.onCopySelectedBelow}
        onCopyToEndOfRound={this.onCopyToEndOfRound}
        onCopyToNewRound={this.onCopyToNewRound}
        onDeleteSelectedRows={this.onDeleteSelectedRows}
        onCopySelectedAbove={this.onCopySelectedAbove}
      />
    );

    const ToolBar = (
      <Toolbar>
        <AddNewRoundButton
          newRows={newRows}
          handleAddNewRound={this.addNewRound}
        />
      </Toolbar>
    );
    const DataGrid = (
      <div>
        <style type="text/css">{styling}</style>

        <SettingsDialog
          rules={rules}
          show={showSettings}
          handleDeleteColorRule={this.handleDeleteColorRule}
          handleAddColorRule={this.handleAddColorRule}
          handleSettingsClick={this.handleSettingsClick}
          handleCommit={this.handleCommitRule}
        />

        <TopSection
          rows={rows.length}
          round={selectedRound}
          roundSummary={roundSummary}
          handleSettingsClick={this.handleSettingsClick}
        />

        {/* rowHeight={50} 
      toolbar={<Toolbar enableFilter={true} 
      */}
        <ReactDataGrid
          minHeight={height}
          contextMenu={contextMenu}
          enableCellSelect={true}
          onColumnResize={this.onColumnResize}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          onCellSelected={this.onCellSelected}
          columns={columns}
          rowGetter={this.rowGetter}
          rowsCount={rows.length}
          scrollToRowIndex={scrollToRowIndex}
          toolbar={ToolBar}
          rowRenderer={
            <RowRenderer
              getProgramColors={this.getProgramColors}
              rules={rules}
            />
          }
        />

        {selectedRounds.length > 0 && <button>Delete Rounds</button>}
      </div>
    );

    const Loader = <LoadingIcon loading={loaded} />;

    return (
      // eslint-disable-next-line
      <div className="rdg">
        {loaded && DataGrid}
        {!loaded && Loader}
      </div>
    );
  }
}

PaintScheduleEditor.defaultProps = {
  rowKey: 'id',
  ruleSet: {}
};

PaintScheduleEditor.propTypes = {
  rowKey: PropTypes.string,
  env: PropTypes.string,
  ruleSet: PropTypes.any
};
export default withAlert(PaintScheduleEditor);
