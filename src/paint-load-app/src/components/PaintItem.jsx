import React, { Component } from "react";
import * as hammer from "hammerjs";
import FontAwesome from "react-fontawesome";

import { Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import PropTypes from "prop-types";
const styles = ["green", "yellow", "orange", "red", "purple", "blue"];
const TextWithTooltip = ({ id, tooltip, children }) => (
  <OverlayTrigger
    overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
    placement="top">
    <span>{children}</span>
  </OverlayTrigger>
);
export default class PaintItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.row = React.createRef();
  }
  componentDidMount() {
    this.hammer = hammer(this.row);
    this.hammer.on("tap", (ev) => {
      console.log("Tappy Tap");
      if (ev.target.classList.contains("tap") && this.props.TapActionHandler) {
        this.props.TapActionHandler(this.props.rowId, ev.target);
      }
      if (
        ev.target.classList.contains("undo") ||
        ev.target.classList.contains("fa-undo")
      ) {
        if (this.props.UndoActionHandler)
          this.props.UndoActionHandler(this.props.rowId);
      }
    });
    this.hammer.on("swipe", (ev) => {
      console.log("Swipe");
      if (this.props.SwipeActionHandler)
        this.props.SwipeActionHandler(this.props.rowId);
    });
  }

  render() {
    const answer = (
      <div
        className={`tap rack-group-${
          styles[parseInt(this.props.data.round_pos, 10) % styles.length]
        }`}>
        {this.props.data.ten}
      </div>
    );
    const getUndo = () => {
      if (
        this.props.role === "assist" &&
        this.props.data.picked_by !== this.props.currentUser.name
      ) {
        return (
          <FontAwesome
            ref={(row) => (this.row = row)}
            size="lg"
            className={`undo rack-group-${
              styles[parseInt(this.props.round_pos, 10) % styles.length]
            }`}
            name="undo"
          />
        );
      } else {
        return answer;
      }
    };

    return (
      <div className="list-group-item row" ref={(row) => (this.row = row)}>
        <Col xs={1} md={1} lg={1}>
          {getUndo()}
        </Col>
        <Col xs={2} md={2} lg={2}>
          <TextWithTooltip tooltip="Description" id="t1">
            {this.props.data.description}
          </TextWithTooltip>
        </Col>
        <Col xs={2} md={2} lg={2}>
          <TextWithTooltip tooltip="Color" id="t2">
            {this.props.data.color}
          </TextWithTooltip>
        </Col>
        <Col xs={2} md={2} lg={2}>
          <TextWithTooltip tooltip="Mold skin style" id="t3">
            {this.props.data.mold_skin_style}
          </TextWithTooltip>
        </Col>
        <Col xs={2} md={2} lg={2}>
          <TextWithTooltip tooltip="Rework color chart" id="t4">
            {this.props.data.rework_color_chart}
          </TextWithTooltip>
        </Col>
        <Col xs={1} md={1} lg={1}>
          <TextWithTooltip tooltip="Quantity" id="t5">
            {this.props.data.quantity}
          </TextWithTooltip>
        </Col>
        <Col xs={2} md={2} lg={2}>
          {this.props.data.picked_by}
        </Col>
      </div>
    );
  }
}
PaintItem.propTypes = {
  environment: PropTypes.string,
  role: PropTypes.string,
  data: PropTypes.any,
  SwipeActionHandler: PropTypes.func,
  TapActionHandler: PropTypes.func,
  currentUser: PropTypes.any
};
