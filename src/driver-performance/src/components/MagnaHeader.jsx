import React, { Component } from "react";
import { VERSION_NUMBER } from "../Constants";
import PropTypes from "prop-types";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Button
} from "@material-ui/core";

import { LocalShipping } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { Wifi } from "@material-ui/icons";
import Logo from "./Logo";

const drawerItems = (
  <div>
    <ListItem button href="/help">
      <ListItemIcon>
        <LocalShipping />
      </ListItemIcon>
      <ListItemText
        primary={<a href="/driver-performance.html">Driver Performance</a>}
      />
    </ListItem>
  </div>
);
const drawerWidth = 240;
const styles = (theme) => ({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  },
  root: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  flex: {
    flex: 1
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

class MagnaHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { drawer: false };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }
  getWifi() {
    if (this.props.showConnectionState)
      return (
        <IconButton>
          <Wifi />
        </IconButton>
      );
  }
  openDrawer() {
    this.setState({ drawer: true });
  }
  closeDrawer() {
    this.setState({ drawer: false });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar color="primary">
            <Button onClick={this.openDrawer}>
              <Logo />
            </Button>

            <Typography className={classes.flex} />
            <Typography>Version : {VERSION_NUMBER}</Typography>

            {this.getWifi()}
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          open={this.state.drawer}
          onOpen={this.openDrawer}
          onClose={this.closeDrawer}
          classes={{
            paper: classes.drawerPaper
          }}>
          <div
            tabIndex={0}
            rule="button"
            onClick={this.closeDrawer}
            onKeyDown={this.closeDrawer}>
            <List>{drawerItems}</List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

MagnaHeader.propTypes = {
  showConnectionState: PropTypes.bool,
  connectionState: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MagnaHeader);
