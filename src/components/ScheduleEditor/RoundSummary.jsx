import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Button, Toolbar, Badge, IconButton } from "@material-ui/core";
import { Settings } from "@material-ui/icons";
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
        <Toolbar>
          <Grid container spacing={24}>
            {badges.map((badge) => (
              <Grid item xs={2} key={badge.content}>
                <Badge
                  color="secondary"
                  badgeContent={
                    this.props.roundSummary[this.props.round][badge.content]
                  }>
                  {badge.name}
                </Badge>
              </Grid>
            ))}
            <Grid item xs={3}>
              <IconButton onClick={this.props.onClick}>
                <Settings />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
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
