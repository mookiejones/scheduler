import React, {
  Component
} from 'react';
import logo from './logo.svg';
import MagnaHeader from './components/MagnaHeader'
import {
  Tab,
  Tabs
} from "@material-ui/core"
import './App.css';
import {
  withStyles
} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
});
class App extends Component {

  constructor(props) {
    super(props)
    this.onTabChanged = this.onTabChanged.bind(this);
    this.state = {
      value: 0
    }
  }
  onTabChanged(event, value) {
    debugger;
  }
  render() {
    const {
      theme
    } = this.props;
    return ( <
      div className = "App" >
      <
      MagnaHeader onTabChanged = {
        this.onTabChanged
      }
      / > <
      SwipeableViews axis = {
        theme.direction === 'rtl' ? 'x-reverse' : 'x'
      }
      index = {
        this.state.value
      }
      onChangeIndex = {
        this.handleChangeIndex
      } > <
      /SwipeableViews>

      <
      /div>
    );
  }
}


export default withStyles(styles, {
  withTheme: true
})(App);