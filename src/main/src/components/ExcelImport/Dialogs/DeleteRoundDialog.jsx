import React, { Component } from "react";

import * as PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Grid
} from "@material-ui/core";

export default class DeleteRoundDialog extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {}

  render() {
    return (
      <Dialog open={this.props.open} aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Delete Round</DialogTitle>
        <DialogContent>
          <FormControl>
            <InputLabel htmlFor="round">Select A Round to Delete</InputLabel>
            <Select onChange={this.handleChange}>
              {this.props.rounds.map((round) => (
                <MenuItem value={round}>{round}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid>
            <Button>Delete Round</Button>
            <Button>Delete All</Button>
            <Button>Cancel</Button>
          </Grid>
          {/* <div className="alert alert-success">
          <a
            href="#"
            className="close"
            onClick={(e) => {
              e.preventDefault();
              this.setState({ alertTxt: { hidden: true } });
            }}
            aria-label="close">
            &times;
          </a>
          <strong>{this.state.alertTxt.bold}</strong> -{" "}
          {this.state.alertTxt.normal}

           <div className="rdg">
        <div id="divDel" className={viewStateClass}>
          Select A Round To Delete:
          <select
            ref={(c) => {
              this.sel = c;
            }}
            onChange={this.onSelChange}>
            {this.state.allRnds.map((r) => {
              const idx = this.state.tchdRnds.indexOf(r);
              if (idx === -1) {
                return (
                  <option key={r} value={r}>
                    {r}
                  </option>
                );
              }
            })}
          </select>
          <br />
          <br />
          <button
            className="btn btn-danger"
            id="btnDelete"
            type="button"
            onClick={this.deleteRound}>
            Delete Round
          </button>
          <span style={{ width: "25px", color: "white" }}>space</span>
          <button
            className="btn btn-danger"
            type="button"
            id="btnDelAll"
            onClick={this.deleteAll}>
            Delete All
          </button>
          <span style={{ width: "25px", color: "white" }}>space</span>
          <button
            className="btn btn-primary"
            type="button"
            id="btnBack"
            onClick={this.showHide}>
            Back
          </button>
        </div>
        </div> */}
        </DialogContent>
      </Dialog>
    );
  }
}

DeleteRoundDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  rounds: PropTypes.array.isRequired
};
