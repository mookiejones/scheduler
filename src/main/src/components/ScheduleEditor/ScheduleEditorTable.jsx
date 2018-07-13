import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody } from '@material-ui/core';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import update from 'react-addons-update';
import ScheduleEditorTableHead from './ScheduleEditorTableHead';
import ScheduleRow from './ScheduleRow';
import DataService from '../../api/DataService';

const Filter = ({ items, predicate, children }) => items.filter(predicate).map(children);

const styles = theme => ({
  root: {
    display: 'table',
    fontFamily: theme.typography.fontFamily,
    // width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0
  }
});

class ScheduleEditorTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRow: null,
      rows: [],
      changedRows: [],
      searchText: ''
    };
    this.showSettings.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    // this.updateStyleCodesAndProgramColors = this.updateStyleCodesAndProgramColors.bind(this);
    // this.updateData = this.updateData.bind(this);
    // this.undoSelection = this.undoSelection.bind(this);

    // this.setRules = this.setRules.bind(this);
    // this.addNewRound = this.addNewRound.bind(this);
    // this.updateColorCodes = this.updateColorCodes.bind(this);
    // this.addNewRoundAnswered = this.addNewRoundAnswered.bind(this);
    // this.onSearchChanged = this.onSearchChanged.bind(this);
    // this.deleteRow = this.deleteRow.bind(this);
    // this.isSelected = this.isSelected.bind(this);
    // this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
    // this.rowGetter = this.rowGetter.bind(this);
  }

  componentDidMount() {
    // getColors()
    //   .then(this.setRules)
    //   .catch(error => {
    //     debugger;
    //   });
    // this.getColorRules();
    // this.getPaintSchedule();
    // this.getStyleCodesAndProgramColors();
    // eslint-disable-next-line
  }

  onSearchChanged(e) {
    this.setState({ searchText: e.target.value });
  }

  handleCellSelect(selected) {
    this.setState({ selectedRound: this.state.rows[selected.rowIdx].round });
  }

  persistNewRow(e, data) {
    console.log('very persistent ;)');
  }

  persistRow(hash, row) {
    const url = '../paint.asmx/UpdatePaintSchedule';

    const updateq = Object.assign({}, this.state.queuedUpdates);

    if (updateq[hash]) return;
    updateq[hash] = 1;

    this.setState({ queuedUpdates: updateq });

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

  addNewRoundAnswered(result) {
    debugger;
    this.setState({ showAddRound: false });
    if (!result) return;
    DataService.ScheduleNewRound()

      .then((o) => {
        debugger;
      })
      .catch((error) => {
        debugger;
      });
  }

  addNewRound() {
    this.setState({ showAddRound: true });
  }

  applyRuleSet(newTable) {
    console.log('apply rule set');
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
    console.log('reset');
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

  rowGetter(idx) {
    return this.state.rows[idx];
  }

  showSettings(e) {
    this.setState({ showSettings: true });
  }

  undoSelection() {
    this.lastSelected = null;
  }

  onRowSelected(e, id, row) {
    this.setState({ selectedRow: row });
    if (this.lastSelected === row) {
      this.setState({ editing: true, selectedRow: row });
    } else {
      this.lastSelected = row;

      setInterval(this.undoSelection, 1500);
    }

    const { selected } = this.state;

    const selectedIndex = selected ? selected.indexOf(id) : -1;
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

  isSelected(id) {
    return this.state.selected.indexOf(id) !== -1;
  }

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    if (fromRow !== toRow) return;

    const rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      var changed = false;
      const rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });
      debugger;
      Object.keys(updated).forEach((key) => {
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
        if (updatedRow.id.includes('TEMP')) {
          if (
            !updatedRow.style_code
            || !(parseInt(updatedRow.pieces, 10) >= 0)
            || !updatedRow.program
            || !updatedRow.round
            || !(parseInt(updatedRow.total_crs, 10) >= 0)
            || !(parseInt(updatedRow.total_pcs, 10) >= 0)
            || updatedRow.customer === undefined
            || !(parseInt(updatedRow.mold_wip_density, 10) >= 0)
            || !updatedRow.round_position
          ) {
            rows[i] = updatedRow;
            this.setState({ rows });
          } else {
            var temp = update(updatedRow, { $merge: { action: 'INSERT' } });
            var hash = '{0}:{1}:{2}'
              .formatUnicorn(updatedRow.id, JSON.stringify(updated), JSON.stringify(temp))
              .hashCode()
              .toString();
            this.persistRow(hash, temp);
          }
        } else {
          var temp = update(updatedRow, { $merge: { action: 'UPDATE' } });
          var hash = '{0}:{1}:{2}'
            .formatUnicorn(updatedRow.id, JSON.stringify(updated), JSON.stringify(temp))
            .hashCode()
            .toString();
          this.persistRow(hash, temp);
        }
        // rows[i] = updatedRow;
      }
    }

    // this.setState({ rows: rows, changedRows: changedRows });
  }

  handleRowUpdateFailed() {}

  onKeyPressed(e) {
    const { key } = e;
    switch (key) {
      case 'Escape':
        break;
      default:
        debugger;
    }
    debugger;
  }

  handleKeyPress(e) {
    this.setState({ selectedRow: null });
  }

  render() {
    const { selectedRow, searchText } = this.state;
    const {
 rules, headers, rows, handleRowChanged, classes, width
} = this.props;
    const c = {};
    for (const rule of rules) {
      c[rule.Name] = { backgroundColor: rule.Color };
    }
    const showRow = (r) => {
      const search = searchText;
      if (search.length === 0) return true;
      const reg = new RegExp(search, 'ig');
      return Object.values(r).filter(v => reg.test(v)).length !== 0;
    };

    return (
      <Table>
        <ScheduleEditorTableHead rules={rules} headers={headers} />

        <TableBody style={{ height: '60vh', overflow: 'auto', display: 'block' }}>
          <Filter items={rows} predicate={showRow}>
            {(row, rowIdx) => (
              <ScheduleRow
                index={rowIdx}
                isSelected={selectedRow === row}
                handleKeyPress={this.handleKeyPress}
                row={row}
                style={{ display: 'block' }}
                rules={rules}
                className={classNames(c)}
                key={`row-${rowIdx}`}
                selected={() => this.isSelected(rowIdx)}
                headers={headers}
                handleRowChanged={handleRowChanged}
                onSelected={event => this.onRowSelected(event, rowIdx, row)}
              />
            )}
          </Filter>
        </TableBody>
      </Table>
    );
  }
}
ScheduleEditorTable.propTypes = {
  width: PropTypes.any,
  rules: PropTypes.array,
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array,
  headers: PropTypes.array.isRequired,
  handleRowChanged: PropTypes.func.isRequired
};
export default withStyles(styles)(ScheduleEditorTable);
