import React, { Component } from "react";
import PropTypes from "prop-types";
import { Badge, Glyphicon, Button } from "react-bootstrap";

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
        { name: "Round", content: "round", color: "default" },
        { name: "Build Count", content: "build_count", color: "success" },
        { name: "Carrier Removal", content: "carrier_removal", color: "secondary" },
        { name: "Tray Counter", content: "tray_counter", color: "primary" }
      ];
      return (
        <div className="data-grid-header-row">
          {badges.map(badge => (
            <div key={badge.content} className="col-sm-3">
              <p>
                <b>{badge.name}: </b>
                <Badge pullRight bsStyle={badge.color}>
                  {this.props.roundSummary[this.props.round][badge.content]}
                </Badge>
              </p>
            </div>
          ))}
          <Button onClick={this.props.onClick}>
            <Glyphicon glyph="cog" />
          </Button>
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
  roundSummary: PropTypes.any,
  onClick: PropTypes.func
};
