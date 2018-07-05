import React, { Component } from "react";
import * as PropTypes from "prop-types";
import DataService from "../../api/DataService";
import * as classnames from "classnames";
import {
  Card,
  CardHeader,
  CardContent,
  ExpansionPanel,
  FormControl,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Paper,
  Input,
  InputLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TextField
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";
import DeleteRoundDialog from "./Dialogs/DeleteRoundDialog";

import { toInt } from "../../Helpers";

export default class ExcelImport extends Component {
  constructor(props, context) {
    super(props, context);

    let env = "development";
    if (props.route !== null && props.route.env) {
      env = props.route.env;
    }

    this.state = {
      env,
      allRnds: [],
      tchdRnds: [],
      selectedIdx: 0,
      mainViewActive: true,
      btnAddDisabled: true,
      btnDeleteDisabled: true,
      importRnds: [],
      problemRows: [],
      infoTxt: "",
      text: "",
      alertTxt: {
        hidden: true,
        bold: "",
        normal: ""
      }
    };
    this.excelTextChanged = this.excelTextChanged.bind(this);
  }
  excelTextChanged(event, value) {
    this.setState({ text: event.target.value });
  }
  componentWillMount() {
    this.loadRound();
  }

  onSelChange(event) {
    const id = event.nativeEvent.target.selectedIndex;
    this.setState({ selectedIdx: id });
  }

  deleteAll() {
    const url =
      this.state.env === "production"
        ? "api/paint/delWholeRound"
        : "api/paint/delWholeRoundTest";

    const shiz = [];
    this.state.allRnds.map((r) => {
      const idx = this.state.tchdRnds.indexOf(r);
      if (idx === -1) shiz.push(r);
    });
    if (shiz.length > 0) {
      DataService.DeleteFromExcel();
      //   $.ajax({
      //     type: "POST",
      //     url,
      //     // data: "{'rnd':'" + shiz.join(',') + "'}",
      //     // contentType: "application/json; charset=utf-8",
      //     // dataType: "json",
      //     data: `rnd=${shiz.join(",")}`,
      //     dataType: "text",
      //     success(msg) {
      //       const temp = msg.d.split("*");
      //       let retStr;
      //       for (let i = 0; i < temp.length; i++) {
      //         const rslt = temp[i].split(",");
      //         if (rslt[1] !== 0) {
      //           retStr = `${retStr}\nSuccess: Round ${
      //             rslt[0]
      //           } has been deleted.\n`;
      //         } else {
      //           retStr = `${retStr}\nError: Round ${
      //             rslt[0]
      //           } has NOT be deleted.\n`;
      //         }
      //       }
      //       this.loadRound();
      //       alert(retStr);
      //     },
      //     error(request) {
      //       alert(request.responseText);
      //     }
      //   });
    } else {
      this.setState({
        alertTxt: {
          hidden: false,
          bold: "Ready for import",
          normal: "No rounds to delete"
        }
      });
    }
    // BEGIN Ajax call
  }
  deleteRound() {
    const rnd = toInt(this.sel.options[this.state.selectedIdx].value);
    const url =
      this.state.env === "production"
        ? "api/paint/delWholeRound"
        : "api/paint/delWholeRoundTest";

    if (rnd > 0) {
      DataService.DeleteRound();
      //   $.ajax({
      //     type: "POST",
      //     url,
      //     // data: "{'rnd':'" + rnd + "'}",
      //     data: `rnd=${rnd}`,
      //     // contentType: "application/json; charset=utf-8",
      //     // dataType: "json",
      //     dataType: "text",
      //     success(msg) {
      //       let temp;
      //       temp = msg.d;
      //       if (temp !== 0) {
      //         this.loadRound();
      //         alert(`Round: ${rnd} has been successfully deleted.`);
      //       } else {
      //         alert("This round can not be deleted, it has already started.");
      //       }
      //     },
      //     error(request) {
      //       alert(request.responseText);
      //     }
      //   });
    }
    // alert(this.state.selectedRnd);
  }
  toDB() {
    const { length } = this.state.importRnds;
    const data = JSON.stringify({ tblData: this.state.importRnds });
    // var data = "tblData=" + this.state.importRnds;
    const revise = this.revisionInput.value;
    let url = "api/paint/savePntRevise";
    let url2 = "api/paint/pntSchlImport2";

    if (this.state.env === "development") {
      url = "api/paint/savePntReviseTest";
      url2 = "api/paint/pntSchlImport2Test";
    }

    if (revise.length > 0) {
      //   $.ajax({
      //     type: "POST",
      //     url,
      //     // data: "{'revise':'" + revise + "'}",
      //     // contentType: "application/json; charset=utf-8",
      //     // dataType: "json",
      //     data: `revise=${revise}`,
      //     dataType: "text",
      //     success(msg) {
      //       console.log(msg);
      //       let temp;
      //       temp = msg.d;
      //       if (temp !== "0") {
      //       } else {
      //         alert("ERROR! You revision was not saved.");
      //       }
      //     },
      //     error(request) {
      //       alert(request.responseText);
      //     }
      //   });
      //   $.ajax({
      //     type: "POST",
      //     url: url2,
      //     data,
      //     contentType: "application/json; charset=utf-8",
      //     dataType: "json",
      //     success(msg) {
      //       console.log(msg);
      //       const alertText =
      //         toInt(msg.d) === length
      //           ? "All rows successfull imported"
      //           : `${msg.d}/${length} rows imported`;
      //       alert(alertText);
      //       this.textArea.value = "";
      //       this.loadRound();
      //     },
      //     error(request) {
      //       alert(request.responseText);
      //     }
      //   });
    }
  }
  tblCheck(OneRC, RC) {
    if (OneRC === 22) {
      // var DB = 'paint_schedule_master'
      if (
        this.revisionInput.value !== "" &&
        this.revisionInput.value !== null &&
        this.revisionInput.value !== undefined
      ) {
        this.setState({
          btnAddDisabled: false,
          infoTxt: `Table has ${RC} Rows and ${OneRC} Columns.`
        });
      } else {
        this.setState({
          btnAddDisabled: true,
          infoTxt: "Please enter a new schedule revision number"
        });
      }
    } else {
      this.setState({
        btnAddDisabled: true,
        infoTxt: `Error! Invalid number of columns data can NOT be imported to the database.\nTable has ${RC} Rows and ${OneRC} Columns.`
      });
    }
  }
  generateTable() {
    let err = false;
    let OneRC = 0;

    const data = this.textArea.value;
    const rows = data.split("\n");

    const tbl = rows.map((r) =>
      r.split("\t").map((c, cIdx) => {
        // 14 = round column  eaafaf
        if (cIdx === 14) {
          if (this.state.allRnds.indexOf(c) > -1) {
            err = true;
          }
        }

        return c;
      })
    );

    // return if columns 0, 1 and 20 are integers. styleCode, pieces, mold wip
    const baddies = [];
    const scrubbedTbl = [];
    tbl.map((r, rIdx) => {
      if (
        !isNaN(r[0]) &&
        !isNaN(r[1]) &&
        !isNaN(r[20]) &&
        r[0] !== "" &&
        r[1] !== "" &&
        r[20] !== ""
      ) {
        r[3] = isNaN(r[3]) || r[3] === "" ? 0 : Math.round(r[3]); // add_take_off
        r[4] = isNaN(r[4]) || r[4] === "" ? 0 : Math.round(r[4]); // total_crs
        r[10] = isNaN(r[10]) || r[10] === "" ? 0 : Math.round(r[10]); // blank
        r[11] = isNaN(r[11]) || r[11] === "" ? 0 : Math.round(r[11]); // total_crs_2
        r[12] = isNaN(r[12]) || r[12] === "" ? 0 : Math.round(r[12]); // total_pcs
        r[14] = isNaN(r[14]) || r[14] === "" ? 0 : Math.round(r[14]); // round
        r[15] = isNaN(r[15]) || r[15] === "" ? 0 : Math.round(r[15]); // crs_real_time
        r[16] = isNaN(r[16]) || r[16] === "" ? 0 : Math.round(r[16]); // abo_1
        r[18] = isNaN(r[18]) || r[17] === "" ? 0 : Math.round(r[18]); // abo_3

        scrubbedTbl.push(r);
      } else {
        baddies.push(r);
      }
    });

    OneRC = tbl[0].length;

    if (!err) {
      this.setState({ importRnds: scrubbedTbl, problemRows: baddies });
      this.tblCheck(OneRC, tbl.length);
    } else {
      alert("Duplicate round!");
    }
  }
  showHide() {
    const currentViewState = this.state.mainViewActive;
    console.log(currentViewState);
    const shiz = [];
    this.state.allRnds.map((r) => {
      const idx = this.state.tchdRnds.indexOf(r);
      if (idx === -1) shiz.push(r);
    });
    if (currentViewState) {
      if (shiz.length < 1) {
        this.setState({
          alertTxt: {
            hidden: false,
            bold: "Ready for import",
            normal: "No rounds to delete"
          }
        });
      } else {
        this.setState({ mainViewActive: !currentViewState });
      }
    } else {
      this.setState({ mainViewActive: !currentViewState });
    }
  }
  loadRound() {
    console.log(this.state.env);

    const url =
      this.state.env === "production"
        ? "api/paint/getRounds"
        : "api/paint/getRoundsTest";

    // $.ajax({
    //   type: "POST",
    //   url,
    //   // data: "{'go':'2'}",
    //   // contentType: "application/json; charset=utf-8",
    //   // dataType: "json",
    //   data: "go=2",
    //   dataType: "text",
    //   success(msg) {
    //     const temp = msg.d;
    //     if (temp === "-1") {
    //       // allRnds = [];
    //       // tchdRnds = [];
    //       this.setState({ allRnds: [], tchdRnds: [] });
    //     } else {
    //       const twoLists = temp.split("@@@");
    //       // allRnds = twoLists[0].split("***");
    //       // tchdRnds = twoLists[1].split("***");
    //       this.setState({
    //         allRnds: twoLists[0].split("***"),
    //         tchdRnds: twoLists[1].split("***")
    //       });
    //       // showSetRounds();
    //     }
    //   },
    //   error(request) {
    //     alert(request.responseText);
    //   }
    // });
  }
  render() {
    const viewStateClass = classnames({
      hidden: this.state.mainViewActive
    });
    const viewStateClass2 = classnames({
      hidden: !this.state.mainViewActive
    });
    const alertClass = classnames({
      hidden: this.state.alertTxt.hidden
    });

    const d1 = this.state.btnAddDisabled;

    return (
      <Grid>
        {/* Top Buttons */}
        <DeleteRoundDialog open={false} rounds={this.state.allRnds} />
        <Grid>
          <Paper>
            <Card>
              <CardHeader title="Paint Schedule Import Data" />

              <CardContent>
                Copy and paste the round you would like to import from excel
                into the textarea below. Next hit the 'Backspace' ONCE to remove
                the extra line return from the end of your data. Then hit
                'Generate Table', and if you have the correct number of columns
                you will now be able to hit 'Import Data'.
              </CardContent>
            </Card>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                Notes
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  You must copy and paste the data from Excel. - If your data
                  does not have the correct number of columns you can NOT import
                  it. (17 columns) - Check to make sure there is not an extra
                  line return at the end of you data(don't hit 'Enter' after
                  last line) this will mess up your column count. Example
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Paper>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                style={{ flex: 1 }}
                helperText="Enter Paint Schedule Revision Name"
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", overflow: "auto", height: "50vh" }}>
              <textarea
                style={{
                  display: "flex",
                  overflow: "auto",
                  width: "100%"
                }}
                value={this.state.text}
                onChange={this.excelTextChanged}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button>Generate Table</Button>
              <Button>Import Data</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
ExcelImport.defaultProps = {
  route: PropTypes.any
};
