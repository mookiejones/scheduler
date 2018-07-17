import React, { Component } from 'react';

import PropTypes from 'prop-types';
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
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Wifi, LocalShipping } from '@material-ui/icons';
import ConnectionIndicator from './ConnectionIndicator';
import { VERSION_NUMBER } from '../Constants';
import Logo from './Logo';

const drawerItems = (
  <div>
    <ListItem button href='/help'>
      <ListItemIcon>
        <LocalShipping />
      </ListItemIcon>
      <ListItemText primary={<a href='/driver-performance.html'>Driver Performance</a>} />
    </ListItem>
  </div>
);
const drawerWidth = 240;
const styles = theme => ({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  root: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
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
    this.onConnectionStatusChanged = this.onConnectionStatusChanged.bind(this);
  }

  getWifi() {
    if (this.props.showConnectionState) {
      return (
        <IconButton color={this.props.isConnected ? 'primary' : 'secondary'}>
          <Wifi />
        </IconButton>
      );
    }
  }

  openDrawer() {
    this.setState({ drawer: true });
  }

  closeDrawer() {
    this.setState({ drawer: false });
  }

  onConnectionStatusChanged(name, args, status) {
    if (this.props.onConnectionChanged) this.props.onConnectionChanged(name, args, status);
  }

  render() {
    const { classes, environment, currentUser } = this.props;
    const getUser = (user) => {
      if (user.img && user.img.length > 0) {
        const img = `data:image/png;base64, ${user.img}`;
        return <img src={img} alt='employee id' style={{ borderRadius: '50%', height: '50px' }} />;
      }
      return <div />;
    };
    return (
      <div className={classes.root}>
        <AppBar position='fixed' color='inherit'>
          <Toolbar>
            <Button onClick={this.openDrawer}>
              <Logo />
            </Button>

            <Typography className={classes.flex} />
            {getUser(currentUser)}
            <Typography>{environment}</Typography>

            <Typography>Version : {VERSION_NUMBER}</Typography>

            <ConnectionIndicator onConnectionChanged={this.onConnectionStatusChanged} />
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          open={this.state.drawer}
          onOpen={this.openDrawer}
          onClose={this.closeDrawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div tabIndex={0} rule='button' onClick={this.closeDrawer} onKeyDown={this.closeDrawer}>
            <List>{drawerItems}</List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

MagnaHeader.propTypes = {
  environment: PropTypes.string.isRequired,
  showConnectionState: PropTypes.bool,
  onConnectionChanged: PropTypes.func,
  isConnected: PropTypes.bool,
  showSettings: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onTabChanged: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.any,
    img: PropTypes.string,
    imgPath: PropTypes.string
  }).isRequired
};

export default withStyles(styles)(MagnaHeader);
