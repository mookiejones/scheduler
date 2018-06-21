import React, { Component } from "react";
import { Nav, Navbar, FormGroup, FormControl, Button } from "react-bootstrap";
import CollapsingNavItemWithIcon from "../components/CollapsingNavItemWithIcon";
import SearchBar from "../components/SearchBar";

export default class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hovered: false
    };
  }

  render() {
    const items = [
      { href: "/ScheduleEditor", text: "Schedule Editor", icon: "edit" },
      { href: "/StyleCodes", text: "Style Codes", icon: "qrcode" },
      { href: "/PaintApp", text: "Paint App", icon: "paint-brush" },
      { href: "/ExcelImport", text: "Excel Import", icon: "upload" },
      { href: "/DriverPerformance", text: "Driver Performance", icon: "truck" }
    ];
    return (
      <Navbar fluid>
        <style type="text/css">
          {
            ".row{ border-bottom-style: none; .visible{ visibility:visible;} .hidden: { visibility:hidden'}"
          }
        </style>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">
              <div className="row">
                <img src="./img/magna_m.svg" alt="" height="20" width="20" />
                <span> Magna</span>
              </div>
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {items.map(item => (
              <CollapsingNavItemWithIcon
                key={item.href}
                href={item.href}
                text={`${item.text} `}
                visible={this.state.hovered}
                icon={item.icon}
              />
            ))}
          </Nav>
          <Navbar.Form pullLeft>
            <SearchBar flex />
          </Navbar.Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
