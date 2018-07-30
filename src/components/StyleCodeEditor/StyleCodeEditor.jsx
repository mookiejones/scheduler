import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import PropTypes from 'prop-types';

import update from 'immutability-helper';

import { StyleCodeEditorContextMenu } from '../menus/context';
import RowRenderer from './RowRenderer';
import { Fetch, options, URLS } from '../../shared';
import {
  CustomerOptionsEditor,
  AssemblyFlowOptionsEditor,
  LocationOptionsEditor
} from './editors';

const heightOffset = 150;

function validRow(row) {
  try {
    return (
      row['style_code'].length > 0 &&
      row['style_name'].length > 0 &&
      row['assembly_flow'].length > 0 &&
      row['pcs_per_carrier'].length > 0 &&
      row['customer'].length > 0 &&
      row['mold_wip_rack_density'].length > 0 &&
      row['primary_bag'].length > 0
    );
  } catch (e) {
    console.log(e);
    return false;
  }
}

function eis(e, s, a = null) {
  debugger;
  var idx = -1;
  for (var x = 0; x < s.length; x++) {
    if (a) {
      if (s[x][a] === e) idx = x;
    } else {
      if (s[x] === e) idx = x;
    }
  }
  return idx;
}

export default class StyleCodeEditor extends Component {
  constructor(props) {
    super(props);
    this._columns = [
      {
        key: 'id',
        name: 'Style',
        width: 65,
        editable: false,
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
        name: 'Mold Wip Density',
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
        editable: true
      }
    ];

    this.env = props.env;
    // programs: [      //{ id: item.id, value: item.id, text:item.program, title:item.program }    ],
    this.state = {
      rows: [],
      originalRows: [],

      changedRows: [],
      selectedIds: [],
      programs: [{ id: '1', text: 'Service', title: 'Service', value: '1' }],
      numSelected: 0,
      newRows: 0,
      height: window.innerHeight - heightOffset
    };

    this.setRef = (element) => {
      this.rowRef = element;
    };
    this.handleResize = this.handleResize.bind(this);
    this.updateScheduleStyles = this.updateScheduleStyles.bind(this);
    this.updatePaintSchedulePrograms = this.updatePaintSchedulePrograms.bind(
      this
    );
    this.rowGetter = this.rowGetter.bind(this);
  }

  componentDidMount() {
    this.getStyles();
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  componentDidUpdate(prevProps, prevState) {
    const { changedRows } = this.state;
    if (changedRows.length > 0) {
      this.persistUpdatedRows();
    }
  }

  updateScheduleStyles(data) {
    this.setState({ rows: data, originalRows: data });
  }

  updatePaintSchedulePrograms(data) {
    var programs = data.map(function(item) {
      return {
        id: item.id,
        value: item.id,
        text: item.program,
        title: item.program
      };
    });
    this.setState({ programs: programs });
  }

  getStyles() {
    const url = 'GetPaintScheduleStyles';
    const url2 = 'GetPaintSchedulePrograms';
    const { env } = this.props;

    Fetch(url, env)
      .then(this.updateScheduleStyles)
      .catch(console.error);

    Fetch(url2, env)
      .then(this.updatePaintSchedulePrograms)
      .catch(console.error);
  }

  getPrograms() {
    debugger;
    return this.state.programs;
  }
  rowGetter(rowIdx) {
    return this.state.rows[rowIdx];
  }
  deleteRow(e, data) {
    debugger;
    const { rows, changedRows } = this.state;
    this.state.rows.splice(data.rowIdx, 1);
    this.setState({ rows: rows, changedRows: changedRows });
  }

  insertRowAbove(e, data) {
    debugger;
    this.insertRow(data.rowIdx);
  }

  insertRowBelow(e, data) {
    debugger;
    this.insertRow(data.rowIdx + 1);
  }

  insertRow(rowIdx) {
    debugger;
    const { rows, newRows } = this.state;

    var newRow = {
      id: 'TEMP-ID-' + newRows
    };

    rows.splice(rowIdx, 0, newRow);
    this.setState({ rows: rows, newRows: newRows + 1 });
  }

  handleRowUpdated(e) {
    debugger;

    let rows = this.state.rows.slice();
    let tempRows = this.state.rows.slice();
    var changed = this.state.changedRows.slice();

    tempRows[e.rowIdx] = update(tempRows[e.rowIdx], { $merge: e.updated });

    if (rows[e.rowIdx][e.cellKey] !== e.updated[e.cellKey]) {
      //get last changes
      var changed_row = update(rows[e.rowIdx], { $merge: e.updated });
      var previous_changedRowIdx = this.rowPreviouslyChanged(changed_row.id);

      if (previous_changedRowIdx === -1) {
        changed.push(update(changed_row, { $merge: { action: 'UPDATE' } }));
      } else {
        changed[previous_changedRowIdx] = update(
          changed[previous_changedRowIdx],
          { $merge: e.updated }
        );
      }

      Object.assign(rows[e.rowIdx], e.updated);
      this.setState({ rows: rows, changedRows: changed });
    }
  }
  persistUpdatedRows() {
    debugger;

    const { changedRows, programs } = this.state;

    var valid = [],
      temp = [];
    var url = 'UpdateStyleCodes';

    //console.log(this.state.programs);
    changedRows.forEach((row) => {
      if (!row.id.includes('TEMP')) {
        var idx = eis(row.program, programs, 'text');
        if (idx > -1) {
          row.program = programs[idx]['id'];
        } else {
          var programId = parseInt(row.program, 10);
          if (programId > -1) {
            row.program = programId;
          }
        }

        //row.program = getProgramId(row.program);
        valid.push(row);
      } else {
        temp.push(row);
      }
    });

    if (valid.length > 0) {
      console.log(valid);
      Fetch(url, this.env, options({ rows: valid }))
        .then((d) => {
          //persist to database
          //this.setState({rows: update(data, {$push:[]}), initialRows: update(data, {$push:[]})});
          this.setState({ changedRows: update(temp, { $push: [] }) });
          this.getStyles();
          debugger;
        })
        .catch(Fetch.HandleError);
    }
  }

  persistNewRows() {
    debugger;
    const { changedRows } = this.state;

    var valid = [],
      temp = [];

    changedRows.forEach((row) => {
      if (!row.id.includes('TEMP')) {
        valid.push(row);
      } else {
        temp.push(row);
      }
    });

    const allValid = temp.all(validRow);

    const url = URLS.PersistStyleCodeRow;

    if (allValid) {
      for (var x = 0; x < temp.length; x++) {
        //console.log(temp[x]['program']);
        var param = {
          assembly_flow: temp[x]['assembly_flow'],
          //color_change_program: temp[x]['color_change_program'],
          customer: temp[x]['customer'],
          id: temp[x]['id'],
          mold_wip_rack_density: temp[x]['mold_wip_rack_density'],
          mold_wip_location: temp[x]['mold_wip_location'] || '',
          PartsPerCarrier: temp[x]['pcs_per_carrier'],
          primary_bag: temp[x]['primary_bag'],
          program: temp[x]['program'],
          secondary_bag: temp[x]['secondary_bag'] || '',
          style_code: temp[x]['style_code'],
          style_name: temp[x]['style_name']
        };
        const { env } = this.props;
        Fetch(url, env, options(param))
          .then((d) => this.getStyles())
          .catch(Fetch.HandleError);
      }
    }
  }
  handleRowUpdateFailed() {}
  rowPreviouslyChanged(key) {
    debugger;
    for (var i = 0; i < this.state.changedRows.length; i++) {
      if (this.state.changedRows[i].id === key) return i;
    }
    return -1;
  }
  handleResize(e) {
    this.setState({ height: window.innerHeight - heightOffset });
  }
  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    debugger;
    let rows = this.state.rows.slice();
    let changedRows = this.state.changedRows.slice();
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      const changed = Object.keys(updated).some(
        (key) => rowToUpdate[key] !== updatedRow[key]
      );

      if (changed) {
        var previous_changedRowIdx = this.rowPreviouslyChanged(updatedRow.id);
        if (previous_changedRowIdx === -1) {
          changedRows.push(
            update(updatedRow, { $merge: { action: 'UPDATE' } })
          );
        } else {
          changedRows[previous_changedRowIdx] = update(
            changedRows[previous_changedRowIdx],
            { $merge: updated }
          );
        }
        rows[i] = updatedRow;
      }
    }

    this.setState({ rows: rows, changedRows: changedRows });
  }
  handleGridSort(sortColumn, sortDirection) {
    debugger;
    const { originalRows, rows } = this.state;
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        if (sortColumn === 'id')
          return parseInt(a[sortColumn], 10) > parseInt(b[sortColumn], 10)
            ? 1
            : -1;
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        if (sortColumn === 'id')
          return parseInt(a[sortColumn], 10) < parseInt(b[sortColumn], 10)
            ? 1
            : -1;
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };

    const new_rows =
      sortDirection === 'NONE' ? originalRows.slice(0) : rows.sort(comparer);

    this.setState({ rows: new_rows });
  }
  render() {
    const { newRows, height, rows, programs } = this.state;

    return (
      <div className="rdg">
        <ReactDataGrid
          ref={(grid) => (this.grid = grid)}
          contextMenu={
            <StyleCodeEditorContextMenu
              newRows={newRows > 0}
              onRowDelete={this.deleteRow}
              onRowInsertBelow={this.insertRowBelow}
              onPersistNewRow={this.persistNewRows}
            />
          }
          rowKey="style_code"
          enableCellSelect={true}
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={rows.length}
          minHeight={height}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          onGridSort={this.handleGridSort}
          rowRenderer={
            <RowRenderer programs={programs} getPrograms={this.getPrograms} />
          }
        />
      </div>
    );
  }
}

StyleCodeEditor.propTypes = {
  env: PropTypes.string
};
StyleCodeEditor.defaultProps = {
  rowKey: 'style_code'
};
