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

import {
  PaintAppContainer,
  ExcelImportContainer,
  DriverPerformanceContainer,
  ScheduleEditorContainer
} from './containers';

const ExcelIcon = props => (
  <SvgIcon {...props}>
    <path d='M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,3.5M17,11H13V13H14L12,14.67L10,13H11V11H7V13H8L11,15.5L8,18H7V20H11V18H10L12,16.33L14,18H13V20H17V18H16L13,15.5L16,13H17V11Z' />
  </SvgIcon>
);

const ForkTruck = props => (
  <SvgIcon {...props}>
    <path d='M6,4V11H4C2.89,11 2,11.89 2,13V17A3,3 0 0,0 5,20A3,3 0 0,0 8,17H10A3,3 0 0,0 13,20A3,3 0 0,0 16,17V13L12,4H6M17,5V19H22V17.5H18.5V5H17M7.5,5.5H11.2L14.5,13H7.5V5.5M5,15.5A1.5,1.5 0 0,1 6.5,17A1.5,1.5 0 0,1 5,18.5A1.5,1.5 0 0,1 3.5,17A1.5,1.5 0 0,1 5,15.5M13,15.5A1.5,1.5 0 0,1 14.5,17A1.5,1.5 0 0,1 13,18.5A1.5,1.5 0 0,1 11.5,17A1.5,1.5 0 0,1 13,15.5Z' />
  </SvgIcon>
);
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
function TabContainer({ children, dir }) {
  return (
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
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};
class App extends Component {
  constructor(props) {
    super(props);
    this.onTabChanged = this.onTabChanged.bind(this);
    this.state = {
      value: 0,
      showSettings: false
    };

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onShowSettings = this.onShowSettings.bind(this);
  }

  onTabChanged(event, value) {
    this.setState({
      value
    });
  }

  onHandleChange(event, value) {
    this.setState({
      value
    });
  }

  onShowSettings(a, b) {
    debugger;
  }

  render() {
    const { theme, environment } = this.props;
    const { value } = this.state;

    const views = [
      { view: <ScheduleEditorContainer route={value} />, key: 1 },
      { view: <ExcelImportContainer route={value} />, key: 2 },
      { view: <PaintAppContainer route={value} />, key: 3 },
      { view: <DriverPerformanceContainer route={value} />, key: 4 }
    ];
    return (
      <Grid>
        <MagnaHeader
          onTabChanged={this.onTabChanged}
          showSettings={this.onShowSettings}
          environment={environment}
        />
        <Grid style={{ height: '80%' }}>
          <div style={{ paddingTop: '55px' }}>
            <SwipeableViews
              animateHeight
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
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
          <BottomNavigation value={this.state.value} onChange={this.onHandleChange} showLabels>
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
