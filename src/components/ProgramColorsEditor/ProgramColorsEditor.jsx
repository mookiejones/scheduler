import React, { Component } from 'react';
import classnames from 'classnames';
import update from 'immutability-helper';
import Autocomplete from 'react-autocomplete';
import { Fetch, options as opts, URLS } from '../../shared';

import { styles } from '../styles/program-colors';
import { ReactiveBtn, Grids } from './Components';

const transform2 = (pc) => {
  var program_colors = [];
  var program_color = { program: null, colors: [] };

  for (let { program, color } of pc) {
    if (program_color['program'] === program) {
      program_color['colors'].push({ pc: color });
    } else {
      //if null set program and push color
      //else push object to array and create new one
      if (program_color['program'] == null) {
        program_color['program'] = program;
        program_color['colors'].push({ pc: color });
      } else {
        program_colors.push(program_color);
        program_color = { program: null, colors: [] };
        program_color['program'] = program;
        program_color['colors'].push({ pc: color });
      }
    }
  }
  if (program_color['program'] != null) program_colors.push(program_color);
  return program_colors;
};
function matchInputToProgram(item, value) {
  return item.program.toLowerCase().includes(value.toLowerCase());
}
function indexOf(propName, value, array) {
  for (var x = 0; x < array.length; x++) {
    if (array[x][propName] === value) {
      return x;
    }
  }
  return -1;
}

/**
 * @class ProgramColorsEditor
 */
export default class ProgramColorsEditor extends Component {
  constructor(props) {
    super(props);
    this.env = props.env;
    var temp = {};
    this.state = {
      selectedProgram: '',
      selectedColor: '',
      selectedProgramId: 0,
      selectedColorId: 0,
      programColors: [],
      programs: [],
      colors: [],
      selected: temp
    };
    this.onRowClick = this.onRowClick.bind(this);
    this.gotPaintSchedulePrograms = this.gotPaintSchedulePrograms.bind(this);
    this.gotPaintScheduleColors = this.gotPaintScheduleColors.bind(this);
    this.gotProgramColors = this.gotProgramColors.bind(this);
    this.addNewProgramStyle = this.addNewProgramStyle.bind(this);
    this.filterExistingCombinations = this.filterExistingCombinations.bind(
      this
    );
    this.onAddedNewProgramStyle = this.onAddedNewProgramStyle.bind(this);
  }

  gotProgramColors(data) {
    this.setState({ programColors: transform2(data) });
  }

  gotPaintSchedulePrograms(data) {
    this.setState({ programs: data });
  }

  gotPaintScheduleColors(data) {
    this.setState({ colors: data });
  }
  componentDidMount() {
    Fetch(URLS.GetProgramColors, this.env)
      .then(this.gotProgramColors)
      .catch(console.error);

    Fetch(URLS.GetPaintSchedulePrograms, this.env)
      .then(this.gotPaintSchedulePrograms)
      .catch(console.error);

    Fetch(URLS.GetPaintScheduleColorsForScheduler, this.env)
      .then(this.gotPaintScheduleColors)
      .catch((error) => {
        debugger;
        console.error(error);
      });
  }
  onRowDelete(key) {
    //console.log(key);
    //return function(e, data){ console.log(e); console.log(data); console.log(key)};
  }
  onRowClick(program, idx) {
    debugger;
    var selected = update(this.state.selected, { $merge: {} });
    let prevSel;
    if (selected[program]) {
      debugger;
    } else {
      selected[program] = [];
      debugger;
      selected[program].push(idx);
    }
    prevSel = selected[program].indexOf(idx);
    if (prevSel > -1) {
      selected[program].splice(prevSel, 1);
    } else {
      selected[program].push(idx);
    }
    this.setState({ selected: selected });
  }
  callback(d) {
    console.log(d);
  }
  onRowsSelected() {}
  onRowsDeselected() {}
  onAddedNewProgramStyle(data) {
    debugger;
  }
  addNewProgramStyle() {
    const { selectedProgram, programs, selectedColor, colors } = this.state;
    const { env } = this.props;
    const programIdx = indexOf('program', selectedProgram, programs);
    const colorIdx = indexOf('color', selectedColor, colors);

    const url = 'AddProgramColor';

    // this.setState({ programColors: transform2(arr), selectedColor: '' });
    let body = {};

    if (programIdx > -1 && colorIdx > -1) {
      body = {
        program: programs[indexOf('program', selectedProgram, programs)].id,
        color: this.state.colors[indexOf('color', selectedColor, colors)].id
      };
      Fetch(url, env, opts(body))
        .then(this.onAddedNewProgramStyle)
        .catch((error) => {
          debugger;
        });
    }
  }

  filterExistingCombinations(item, value) {
    const { programColors, selectedProgram } = this.state;

    const exists = programColors.some((color) => {
      if (color.program !== selectedProgram) return false;

      return color.colors.some((c) => c.pc === item.color);
    });

    if (!exists) {
      return item.color.toLowerCase().includes(value.toLowerCase());
    } else {
      return false;
    }
  }

  render() {
    const {
      selectedProgram,
      programs,
      colors,
      programColors,
      selected,
      selectedColor
    } = this.state;

    var BtnClass = classnames({
      btn: true,
      'btn-primary': true,
      disabled:
        this.state.selectedProgram.length < 1 ||
        this.state.selectedColor.length < 1
    });

    return (
      <div className="pcl">
        <div className="well" style={{ marginTop: '15px' }}>
          <h3>Add a New Program Color: </h3>
          <div style={{ display: 'flex' }} className="form-group">
            <div>
              <div>
                <label>Program: </label>
              </div>
              <div style={{ marginLeft: '15px' }}>
                <Autocomplete
                  style={{ marginLeft: '25px' }}
                  menuStyle={styles.menuStyle}
                  value={selectedProgram}
                  inputProps={{
                    name: 'Programs',
                    className: 'form-control',
                    id: 'programs-autocomplete2'
                  }}
                  shouldItemRender={matchInputToProgram}
                  items={programs}
                  getItemValue={(item) => item.program}
                  onChange={(event, value) =>
                    this.setState({ selectedProgram: value })
                  }
                  onSelect={(value) =>
                    this.setState({ selectedProgram: value })
                  }
                  renderItem={(item, isHighlighted) => (
                    <div
                      style={
                        isHighlighted ? styles.highlightedItem : styles.item
                      }
                      key={item.id}>
                      {item.program}
                    </div>
                  )}
                />
              </div>
            </div>
            <div>
              <div>
                <label>Color: </label>
              </div>
              <div style={{ marginLeft: '15px' }}>
                <Autocomplete
                  menuStyle={styles.menuStyle}
                  value={selectedColor}
                  inputProps={{
                    name: 'Programs',
                    className: 'form-control',
                    id: 'programs-autocomplete'
                  }}
                  shouldItemRender={this.filterExistingCombinations}
                  items={colors}
                  getItemValue={(item) => item.color}
                  onChange={(event, value) =>
                    this.setState({ selectedColor: value })
                  }
                  onSelect={(value) => this.setState({ selectedColor: value })}
                  renderItem={(item, isHighlighted) => (
                    <div
                      style={
                        isHighlighted ? styles.highlightedItem : styles.item
                      }
                      key={item.id}>
                      {item.color}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <ReactiveBtn
            style={{ marginLeft: '15px' }}
            clickEvent={this.addNewProgramStyle}
            text="Add"
            className={BtnClass}
          />
        </div>
        <ul className="list">
          {programColors.map(function(program, i) {
            return (
              <Grids
                key={i}
                cb={this.callback}
                programColors={program}
                onRowClick={this.onRowClick}
                selectedIndexes={selected[program.program]}
              />
            );
          }, this)}
        </ul>
      </div>
    );
  }
}
