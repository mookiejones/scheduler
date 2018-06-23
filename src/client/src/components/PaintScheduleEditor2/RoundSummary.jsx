import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, Label, Glyphicon, Button } from "react-bootstrap";
import FontAwesome from "react-fontawesome";

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
        {
          name: "Carrier Removal",
          content: "carrier_removal",
          color: "secondary"
        },
        { name: "Tray Counter", content: "tray_counter", color: "primary" }
      ];
      return (
        <Grid>
          <Row>
            {badges.map(badge => (
              <Col sm={3} key={badge.content}>
                {badge.name}
                <Label bsClass={`label label-round label-${badge.color}`}>
                  {this.props.roundSummary[this.props.round][badge.content]}
                </Label>
              </Col>
            ))}
            <Button bsStyle="link">
              <FontAwesome name="cog" size="2x" onClick={this.props.onClick} />
            </Button>
          </Row>
        </Grid>
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
