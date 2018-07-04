import { AppBar, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar, Typography } from "@material-ui/core";
import { StyleRulesCallback, withStyles } from "@material-ui/core/styles";
import { LocalShipping, Wifi } from "@material-ui/icons";
import React, { Component } from "react";
import { VERSION_NUMBER } from "scheduler-constants";
import ConnectionIndicator from "./ConnectionIndicator";
import Logo from "./Logo";

const drawerWidth = 240;
const styles:StyleRulesCallback = (theme) => ({
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

interface IProps{
  listItems?:Array<any>,
  showConnectionState: boolean,
  onConnectionChanged: (name:string,args:any,connected:boolean)=>void,
  isConnected: boolean,
  classes: any
}

interface IState{
  drawer:boolean  
}

/**
 * @description HeaderBar for Magna Apps
 */
class MagnaHeader extends Component<IProps,IState> {
  constructor(props:IProps) {
    super(props);
    this.state = { drawer: false };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onConnectionStatusChanged = this.onConnectionStatusChanged.bind(this);
  }

  getWifi() {
    if (this.props.showConnectionState){
      return (
        <IconButton color={this.props.isConnected ? "primary" : "secondary"}>
          <Wifi />
        </IconButton>
      );
    }
      else
      {
      return (<div/>);
      }
  }
  openDrawer() {
    this.setState({ drawer: true });
  }
  closeDrawer() {
    this.setState({ drawer: false });
  }
  onConnectionStatusChanged(name:string, args:any, status:boolean) {
    if (this.props.onConnectionChanged)
      this.props.onConnectionChanged(name, args, status);
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

            <ConnectionIndicator
              onConnectionChanged={this.onConnectionStatusChanged}
            />
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
            onClick={this.closeDrawer}
            onKeyDown={this.closeDrawer}>
            <List>
    <ListItem button href="/help">
      <ListItemIcon>
        <LocalShipping />
      </ListItemIcon>
      <ListItemText
        primary={<a href="/driver-performance.html">Driver Performance</a>}
      />
    </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

export default withStyles(styles)(MagnaHeader);
