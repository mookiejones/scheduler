import React, { Component } from "react";
import PropTypes from "prop-types";
import { Badge } from "react-bootstrap";

export class RoundSummary extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      roundSummary: props.roundSummary,
      round: props.round
    };
  }
  render() {
    if (this.props.round > 0) {
      const badges = [
        { name: "Round", content: "round" },
        { name: "Build Count", content: "build_count" },
        { name: "Carrier Removal", content: "carrier_removal" },
        { name: "Tray Counter", content: "tray_counter" }
      ];
      return (
        <div className="data-grid-header-row">
          {badges.map(badge => (
            <div key={badge.content} className="col-sm-3">
              <p>
                <b>{badge.name}: </b>
                <Badge pullRight>{this.props.roundSummary[this.props.round][badge.content]}</Badge>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "rgb(249, 249, 249)",
          margin: "auto"
        }}
      />
    );
  }
}

RoundSummary.propTypes = {
  round: PropTypes.string,
  roundSummary: PropTypes.any
};
