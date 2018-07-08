import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Badge
} from "@material-ui/core";
const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  }
});
class ListTop extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentRoundNumber: 0,
      currentRevision: 0
    };
  }
  getPaintLabel() {
    const result =
      this.props.role === "load"
        ? "Load"
        : this.props.role === "stage"
          ? "Staging"
          : "Pick";
    return `Paint ${result} List `;
  }
  getEnvironmentLabel() {
    return this.props.environment === "production"
      ? ""
      : `(${this.props.environment})`;
  }
  getCurrentRoundLabel() {
    debugger;
  }
  render() {
    const { classes } = this.props;
    const paintLabel = this.getPaintLabel();
    const environmentLabel = this.getEnvironmentLabel();
    return (
      <Grid>
        <Card>
          <CardHeader title={paintLabel} />
          <CardContent>
            <Badge
              className={classes.margin}
              color="primary"
              badgeContent={this.state.currentRoundNumber}>
              <Typography className={classes.padding}>Current Round</Typography>
            </Badge>
            <Badge
              className={classes.margin}
              color="primary"
              badgeContent={this.state.currentRevision}>
              <Typography className={classes.padding}>
                Schedule Revision
              </Typography>
            </Badge>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

ListTop.propTypes = {
  currentRevision: PropTypes.string,
  currentRoundNumber: PropTypes.number,
  environment: PropTypes.string,
  role: PropTypes.string,
  connectionState: PropTypes.string,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ListTop);
