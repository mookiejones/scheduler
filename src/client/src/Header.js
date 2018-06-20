import React, { Component } from "react";
import { Nav, Navbar, NavDropdown, NavItem, MenuItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSVG from "react-svg";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

console.log(`process: ${process.cwd()}`);
console.log(`dir: ${__dirname}`);

// A simple component that shows the pathname of the current location
class ShowTheLocation extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { match, location, history } = this.props;

    return <div>You are now at {location.pathname}</div>;
  }
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
const ShowTheLocationWithRouter = withRouter(ShowTheLocation);

export class Header extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">
              <ReactSVG path="./logo.svg" />
            </a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem href="/ScheduleEditor">Schedule Editor</NavItem>
          <NavItem href="/style-codes">Style Codes</NavItem>
          <NavItem href="/paint-app">Paint App</NavItem>
          <NavItem href="/ExcelImport">Excel Import</NavItem>
          <NavItem href="/sign-in">Sign In</NavItem>
          <NavItem href="/DriverPerformance">Driver</NavItem>

          <NavDropdown title="Sub Components" id="subComponents">
            <NavDropdown title="Paint App" id="paintApp">
              <MenuItem href="/login">Login</MenuItem>
            </NavDropdown>
          </NavDropdown>
          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.4}>Separated link</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}
