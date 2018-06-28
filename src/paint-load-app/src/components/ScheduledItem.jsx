import React, { Component } from "react";
import UndoCell from "./UndoCell";
import Description from "./Description";
import Calculator from "./Calculator";
import RackOwner from "./RackOwner";
import WorkTimer from "./WorkTimer";
import PropTypes from "prop-types";
// import * as hammer from "hammerjs";

const COLUMN_DEFINITIONS = [
  /* eslint-disable */
  {
    title: "",
    data: 0,
    className: "undo",
    orderable: false,
    CellRenderer: UndoCell,
  },
  { title: "master_id", data: 1, visible: false, orderable: false },
  { title: "round", data: 2, visible: false, orderable: true },
  { title: "round pos", data: 3, visible: false, orderable: true },
  {
    title: "Description",
    data: 4,
    className: "tap",
    orderable: false,
    CellRenderer: Description,
  },
  { title: "notes", data: 5, visible: false, orderable: false },
  { title: "Color", data: 6, className: "tap", orderable: false },
  { title: "Mold Skin Style", data: 7, className: "tap", orderable: false },
  { title: "Rework Color Chart", data: 8, className: "tap", orderable: false },
  { title: "Quantity", data: 9, className: "tap", orderable: false },
  {
    title: "",
    data: null,
    className: "action",
    orderable: false,
    visible: true,
    CellRenderer: Calculator,
  },
  { data: 10, visible: false },
  {
    title: "StagedBy",
    data: 11,
    visible: false,
    className: "tap",
    orderable: false,
  },
  {
    title: "handledBy",
    data: 12,
    visible: false,
    className: "tap",
    orderable: false,
  },
  {
    title: "Picked By",
    data: 13,
    className: "pickedBy tap",
    orderable: false,
    visible: true,
    CellRenderer: RackOwner,
  },
  /* eslint-enable */
];

export default class ScheduledItem {
  componentDidCatch(error, info) {
    debugger;
  }
  componentWillMount() {
    //toDo  add GetLodedBy field in rowData.
    this.setSharedProps(
      this.props.rowData[13],
      this.props.rowData[12],
      this.props.rowData[11],
      "##AVAILABLE##",
    );
  }

  componentDidMount() {
    debugger;
    /*    this.hammer = hammer(this.row);
    this.hammer.on("tap", ev => {
      if (ev.target.classList.contains("tap")) {
        this.props.TapActionHandler(this.props.rowId, ev.target);
      }
      if (
        ev.target.classList.contains("undo") ||
        ev.target.classList.contains("fa-undo")
      ) {
        this.props.UndoActionHandler(this.props.rowId);
      }
    });
    this.hammer.on("swipe", ev => {
      this.props.SwipeActionHandler(this.props.rowId);
    });*/
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.rowData[11] !== this.props.rowData[11] ||
      nextProps.rowData[12] !== this.props.rowData[12] ||
      nextProps.rowData[13] !== this.props.rowData[13] ||
      nextProps.rowData[9] !== this.props.rowData[9]
    );
  }

  componentWillUpdate(nextProps) {
    //toDo  GetLodedBy parameter in api call.
    this.setSharedProps(
      nextProps.rowData[13],
      nextProps.rowData[12],
      nextProps.rowData[11],
      "##AVAILABLE##",
    );
  }

  componentWillUnmount() {
    this.hammer.off("tap");
    this.hammer.off("swipe");
    this.hammer.destroy();
    this.hammer = null;
  }

  setSharedProps(grabbedBy, handledBy, stagedBy, loadedBy) {
    this.grabbedBy = grabbedBy;
    //this.handledBy = handledBy;
    //this.stagedBy =  stagedBy;
    //this.loadedBy = loadedBy;
    this.processStep = this.getScheduleItemProcessStep(
      grabbedBy,
      handledBy,
      stagedBy,
      loadedBy,
    );

    this.scheduledItemStyle = this.getScheduledItemCssClass(
      grabbedBy,
      handledBy,
      stagedBy,
      loadedBy,
    );
  }

  getScheduledItemCssClass(grabbedBy, handledBy, stagedBy, loadedBy, role) {
    var cssClass;
    if (
      this.props.role == "assist" &&
      grabbedBy == this.props.currentUser.name
    ) {
      cssClass = "myRow";
    } else if (
      this.props.role == "assist" &&
      grabbedBy != "##AVAILABLE##" &&
      grabbedBy != this.props.currentUser.name
    ) {
      cssClass = "theirRow";
    } else if (
      (this.props.role == "stage" && handledBy != "##AVAILABLE##") ||
      (this.props.role == "load" && stagedBy != "##AVAILABLE##")
    ) {
      cssClass = "ready";
    } else if (
      (this.props.role == "stage" &&
        grabbedBy != "##AVAILABLE##" &&
        handledBy == "##AVAILABLE##") ||
      (this.props.role == "load" &&
        handledBy != "##AVAILABLE##" &&
        stagedBy == "##AVAILABLE##")
    ) {
      cssClass = "intransit";
    } else {
      cssClass = "";
    }
    return cssClass;
  }

  getScheduleItemProcessStep(grabbedBy, handledBy, stagedBy, loadedBy) {
    var processStep;
    if (
      grabbedBy == "##AVAILABLE##" &&
      handledBy == "##AVAILABLE##" &&
      stagedBy == "##AVAILABLE##" &&
      loadedBy == "##AVAILABLE##"
    ) {
      //Assist-NotStarted
      //processStep = 0;
      processStep = "ASSIST-NOT_STARTED";
    } else if (
      grabbedBy != "##AVAILABLE##" &&
      handledBy == "##AVAILABLE##" &&
      stagedBy == "##AVAILABLE##" &&
      loadedBy == "##AVAILABLE##"
    ) {
      //Assist-InProcess
      //processStep = 1;
      processStep = "ASSIST-IN_PROCESS";
    } else if (
      grabbedBy != "##AVAILABLE##" &&
      handledBy != "##AVAILABLE##" &&
      stagedBy == "##AVAILABLE##" &&
      loadedBy == "##AVAILABLE##"
    ) {
      //Assist-Completed
      //processStep = 2;
      processStep = "ASSIST-COMPLETED";
    } else if (
      grabbedBy != "##AVAILABLE##" &&
      handledBy != "##AVAILABLE##" &&
      stagedBy != "##AVAILABLE##" &&
      loadedBy == "##AVAILABLE##"
    ) {
      //Stage-Completed
      //processStep = 3;
      processStep = "STAGE-COMPLETED";
    } else if (
      grabbedBy != "##AVAILABLE##" &&
      handledBy != "##AVAILABLE##" &&
      stagedBy != "##AVAILABLE##" &&
      loadedBy != "##AVAILABLE##"
    ) {
      //Load-Completed
      //processStep = 4;
      processStep = "LOAD-COMPLETED";
    }
    return processStep;
  }

  render() {
    // this.styles = classnames({
    //   'myRow': this.props.role == 'assist' && grabbedBy == this.props.currentUser.name,
    //   'theirRow': this.props.role == 'assist' && grabbedBy != "##AVAILABLE##" && (grabbedBy != this.props.currentUser.name),
    //   'ready': (this.props.role == 'stage' && handledBy != "##AVAILABLE##") || (this.props.role == 'load' && stagedBy != "##AVAILABLE##"),
    //   'intransit': (this.props.role == 'stage' && grabbedBy != "##AVAILABLE##" && handledBy == "##AVAILABLE##") || (this.props.role == 'load' && handledBy != "##AVAILABLE##" && stagedBy == "##AVAILABLE##")
    // });

    return (
      <tr>
        <td className="tap">
          {/* <UndoCell
            key={this.props.rowData[0] + "-0"}
            currentUser={this.props.currentUser}
            role={this.props.role}
            rowData={this.props.rowData}
          /> */}
        </td>
        <td className="tap">
          {/* <Description
            key={this.props.rowData[0] + "-1"}
            rowData={this.props.rowData}
          /> */}
        </td>
        <td key={this.props.rowData[0] + "-6"} className="tap">
          {/* {this.props.rowData[6]} */}
        </td>
        <td key={this.props.rowData[0] + "-7"} className="tap">
          {/* {this.props.rowData[7]} */}
        </td>
        <td key={this.props.rowData[0] + "-8"} className="tap">
          {/* {this.props.rowData[8]} */}
        </td>
        <td key={this.props.rowData[0] + "-9"} className="tap">
          {/* {this.props.rowData[9]} */}
        </td>
        <td className="tap">
          {/* <Calculator
            key={this.props.rowData[0] + "-10"}
            rowData={this.props.rowData}
            currentUser={this.props.currentUser}
            role={this.props.role}
            updatePartialQty={this.props.updatePartialQty}
          /> */}
        </td>
        <td className="tap">
          {/* <RackOwner
            key={this.props.rowData[0] + "-11"}
            currentUser={this.props.currentUser}
            rackOwner={this.grabbedBy}
          /> */}
          {/* <WorkTimer
            key={this.props.rowData[0] + "-12"}
            rowData={this.props.rowData}
            currentUser={this.props.currentUser}
            rackOwner={this.grabbedBy}
            processStep={this.processStep}
          /> */}
        </td>
      </tr>
    );
  }
}

ScheduledItem.propTypes = {
  currentUser: PropTypes.any,
  role: PropTypes.string,
  rowId: PropTypes.any,
  rowData: PropTypes.any,

  SwipeActionHandler: PropTypes.any,
  TapActionHandler: PropTypes.any,
  UndoActionHandler: PropTypes.any,
  updatePartialQty: PropTypes.any,
};
