import { Component } from "react";
import classnames from "classnames";
import ReactDataGrid, { Row } from "react-data-grid";
import * as update from "react-addons-update";
import RowRenderer from "./ProgramColorsEditor.RowRenderer";
import * as AutoCompleter from "react-autocomplete";
import { Button } from "react-bootstrap";
import { ProgramColorsContextMenu } from "./Context.js";
import { styles } from "./styles";
import ReactiveBtn from "./ProgramColorsEditor.ReactiveBtn";
import Grids from "./ProgramColorsEditor.Grids";
function transform2(pc) {
  debugger;
  var program_colors = [];
  var program_color = { program: null, colors: [] };

  for (var x = 0; x < pc.length; x++) {
    if (program_color["program"] == pc[x]["program"]) {
      program_color["colors"].push({ pc: pc[x]["color"] });
    } else {
      //if null set program and push color
      //else push object to array and create new one
      if (program_color["program"] == null) {
        program_color["program"] = pc[x]["program"];
        program_color["colors"].push({ pc: pc[x]["color"] });
      } else {
        program_colors.push(program_color);
        program_color = { program: null, colors: [] };
        program_color["program"] = pc[x]["program"];
        program_color["colors"].push({ pc: pc[x]["color"] });
      }
    }
  }
  if (program_color["program"] != null) program_colors.push(program_color);
  return program_colors;
}
function matchInputToProgram(item, value) {
  return item.program.toLowerCase().includes(value.toLowerCase());
}
function indexOf(propName, value, array) {
  var index = -1;
  for (var x = 0; x < array.length; x++) {
    if (array[x][propName] == value) {
      return x;
    }
  }
  return -1;
}

export default class ProgramColorsEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      env: this.props.route.env,
      selectedProgram: "",
      selectedColor: "",
      selectedProgramId: 0,
      selectedColorId: 0,
      programColors: [],
      programs: [],
      colors: [],
      selected: {}
    };
  }

  componentWillMount() {
    var request = new XMLHttpRequest();
    var request2 = new XMLHttpRequest();
    var request3 = new XMLHttpRequest();

    var url = "api/paint/GetProgramColors";
    var url2 = "api/paint/GetPaintSchedulePrograms";
    var url3 = "api/paint/GetPaintScheduleColors";

    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.response);
        //var arr = JSON.parse(data.d);
        var arr = data;
        this.setState({ programColors: transform2(arr) });
      } else {
      }
    };
    request.send(JSON.stringify({}));

    request2.open("POST", url2, true);
    request2.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request2.onload = () => {
      if (request2.status >= 200 && request2.status < 400) {
        var data = JSON.parse(request2.response);
        //var arr = JSON.parse(data.d);
        var arr = data;
        //console.log(arr);
        this.setState({ programs: arr });
      } else {
      }
    };
    request2.send(JSON.stringify({}));

    request3.open("POST", url3, true);
    request3.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request3.onload = () => {
      if (request3.status >= 200 && request3.status < 400) {
        var data = JSON.parse(request3.response);
        var arr = JSON.parse(data.d);
        //console.log(arr);
        this.setState({ colors: arr });
      } else {
      }
    };
    request3.send(JSON.stringify({}));
  }
  onRowDelete(key: any) {
    //console.log(key);
    //return function(e, data){ console.log(e); console.log(data); console.log(key)};
  }
  onRowClick(program: any, idx: any) {
    var selected = update(this.state.selected, { $merge: {} });
    var prevSel = selected[program].indexOf(idx);
    if (prevSel > -1) {
      selected[program].splice(prevSel, 1);
    } else {
      selected[program].push(idx);
    }
    this.setState({ selected: selected });
  }
  callback(d: any) {
    console.log(d);
  }
  onRowsSelected() {}
  onRowsDeselected() {}
  addNewProgramStyle() {
    var request = new XMLHttpRequest();
    var url = "api/paint/AddProgramColor";

    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.response);
        //var arr = JSON.parse(data.d);
        var arr = data;
        this.setState({ programColors: transform2(arr), selectedColor: "" });
      } else {
      }
    };

    var programIdx = indexOf("program", this.state.selectedProgram, this.state.programs);
    var colorIdx = indexOf("color", this.state.selectedColor, this.state.colors);

    if (programIdx > -1 && colorIdx > -1) {
      request.send(
        JSON.stringify({
          program: this.state.programs[
            indexOf("program", this.state.selectedProgram, this.state.programs)
          ].id,
          color: this.state.colors[indexOf("color", this.state.selectedColor, this.state.colors)].id
        })
      );
    }
  }
  filterExistingCombinations(item: any, value: any) {
    var exists = false;
    for (var x = 0; x < this.state.programColors.length; x++) {
      if (this.state.programColors[x].program == this.state.selectedProgram) {
        for (var y = 0; y < this.state.programColors[x].colors.length; y++) {
          if (this.state.programColors[x].colors[y].pc == item.color) {
            exists = true;
          }
        }
      }
    }
    if (!exists) {
      return item.color.toLowerCase().includes(value.toLowerCase());
    } //else{ return false }
  }
  render() {
    let BtnClass = classnames({
      btn: true,
      "btn-primary": true,
      disabled: this.state.selectedProgram.length < 1 || this.state.selectedColor.length < 1
    });

    return (
      <div className="pcl">
        <div className="well" style={{ marginTop: "15px" }}>
          <h3>Add a New Program Color: </h3>
          <div style={{ display: "flex" }} className="form-group">
            <div>
              <div>
                <label>Program: </label>
              </div>
              <div style={{ marginLeft: "15px" }}>
                <Autocomplete
                  style={{ marginLeft: "25px" }}
                  menuStyle={styles.menuStyle}
                  value={this.state.selectedProgram}
                  inputProps={{
                    name: "Programs",
                    className: "form-control",
                    id: "programs-autocomplete2"
                  }}
                  shouldItemRender={matchInputToProgram}
                  items={this.state.programs}
                  getItemValue={item => item.program}
                  onChange={(event, value) => this.setState({ selectedProgram: value })}
                  onSelect={value => this.setState({ selectedProgram: value })}
                  renderItem={(item, isHighlighted) => (
                    <div style={isHighlighted ? styles.highlightedItem : styles.item} key={item.id}>
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
              <div style={{ marginLeft: "15px" }}>
                <Autocomplete
                  menuStyle={styles.menuStyle}
                  value={this.state.selectedColor}
                  inputProps={{
                    name: "Programs",
                    className: "form-control",
                    id: "programs-autocomplete"
                  }}
                  shouldItemRender={this.filterExistingCombinations}
                  items={this.state.colors}
                  getItemValue={item => item.color}
                  onChange={(event, value) => this.setState({ selectedColor: value })}
                  onSelect={value => this.setState({ selectedColor: value })}
                  renderItem={(item, isHighlighted) => (
                    <div style={isHighlighted ? styles.highlightedItem : styles.item} key={item.id}>
                      {item.color}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <ReactiveBtn
            style={{ marginLeft: "15px" }}
            clickEvent={this.addNewProgramStyle}
            text="Add"
            className={BtnClass}
          />
        </div>
        <ul className="list">
          {this.state.programColors.map(function(program, i) {
            return (
              <Grids
                key={i}
                cb={this.callback}
                programColors={program}
                onRowClick={this.onRowClick}
                selectedIndexes={this.state.selected[program.program]}
              />
            );
          }, this)}
        </ul>
      </div>
    );
  }
}
