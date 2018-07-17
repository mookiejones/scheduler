import React, { Component } from 'react';
import {
  Grid,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  SvgIcon
} from '@material-ui/core';

import { Edit, FormatPaint } from '@material-ui/icons';
import PropTypes from 'prop-types';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import MagnaHeader from './components/MagnaHeader';
import DataService from './api/DataService';
import {
  PaintAppContainer,
  ExcelImportContainer,
  DriverPerformanceContainer,
  ScheduleEditorContainer
} from './containers';
import { ExcelIcon, ForkTruck } from './components/Icons';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
    // width: 500
  }
});

const items = [
  { title: 'Schedule Editor', icon: <Edit /> },
  { title: 'Excel Import', icon: <ExcelIcon /> },
  { title: 'Paint Load', icon: <FormatPaint /> },
  { title: 'Driver Performance', icon: <ForkTruck /> }
];
const TabContainer = ({ children, dir }) => (
  <Typography
    component='div'
    dir={dir}
    style={{
      padding: 8 * 3
    }}
  >
    {children}
  </Typography>
);

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

class App extends Component {
  constructor(props) {
    super(props);
    this.onTabChanged = this.onTabChanged.bind(this);
    this.state = {
      selected: 2,
      showSettings: false,
      isConnected: false,
      currentUser: {
        name: '',
        id: undefined,
        img: ''
      }
    };

    this.onHandleLogin = this.onHandleLogin.bind(this);

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onShowSettings = this.onShowSettings.bind(this);
    this.onConnectionStateChanged = this.onConnectionStateChanged.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  onTabChanged(event, value) {
    this.setState({
      selected: value
    });
  }

  updateUser(user) {
    this.setState({ currentUser: user });
  }

  onHandleLogin(args) {
    DataService.LoginUser(args)
      .then(o => o.text())
      .then((o) => {
        const json = JSON.parse(o).d;
        const result = JSON.parse(json);
        return result;
      })
      .then(this.updateUser)
      .catch((error) => {
        console.error(error);
      });
  }

  onHandleChange(event, value) {
    this.setState({
      selected: value
    });
  }

  onShowSettings(a, b) {
    debugger;
  }

  onConnectionStateChanged(connected) {
    this.setState({ isConnected: connected === 'connected' });
  }

  render() {
    const { theme, environment } = this.props;
    const { selected, currentUser, isConnected } = this.state;

    const views = [
      { view: <ScheduleEditorContainer route={selected} />, key: 1 },
      { view: <ExcelImportContainer route={selected} />, key: 2 },
      {
        view: (
          <PaintAppContainer
            currentUser={currentUser}
            route={selected}
            handleConnectionStateChanged={this.onConnectionStateChanged}
            handleLogin={this.onHandleLogin}
          />
        ),
        key: 3
      },
      { view: <DriverPerformanceContainer route={selected} />, key: 4 }
    ];
    return (
      <Grid>
        <MagnaHeader
          onTabChanged={this.onTabChanged}
          showSettings={this.onShowSettings}
          isConnected={isConnected}
          environment={environment}
          currentUser={currentUser}
        />
        <Grid style={{ height: '80%' }}>
          <div style={{ paddingTop: '55px' }}>
            <SwipeableViews
              animateHeight
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={selected}
              onChangeIndex={this.handleChangeIndex}
            >
              {views.map(view => (
                <TabContainer key={view.key} dir={theme.direction}>
                  {view.view}
                </TabContainer>
              ))}
            </SwipeableViews>
          </div>
        </Grid>
        <footer>
          <BottomNavigation value={selected} onChange={this.onHandleChange} showLabels>
            {items.map((item, idx) => (
              <BottomNavigationAction label={item.title} icon={item.icon} key={`br-${idx}`} />
            ))}
          </BottomNavigation>
        </footer>
      </Grid>
    );
  }
}
App.propTypes = {
  environment: PropTypes.string.isRequired
};
export default withStyles(styles, {
  withTheme: true
})(App);
