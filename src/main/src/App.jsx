import React, { Component } from "react";
import logo from "./logo.svg";
import MagnaHeader from "./components/MagnaHeader";
import { Tab, Tabs, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import "./App.css";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  }
});

function TabContainer({ children, dir }) {
  return (
    <Typography
      component="div"
      dir={dir}
      style={{
        padding: 8 * 3
      }}>
      {" "}
      {children}{" "}
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
      value: 0
    };
  }
  onTabChanged(event, value) {
    this.setState({
      value: value
    });
  }
  render() {
    const { theme } = this.props;
    return (
      <div className="App">
        <MagnaHeader onTabChanged={this.onTabChanged} />{" "}
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}>
          <TabContainer dir={theme.direction}>Item One</TabContainer>
          <TabContainer dir={theme.direction}>Item One</TabContainer>
          <TabContainer dir={theme.direction}>Item One</TabContainer>
          <TabContainer dir={theme.direction}>Item One</TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles, {
  withTheme: true
})(App);
